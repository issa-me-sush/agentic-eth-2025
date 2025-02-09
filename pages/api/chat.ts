import { NextApiRequest, NextApiResponse } from 'next';
import { AI_CONFIG } from '../../config/ai.config';
import { createCompletion, processMessageStream } from '../../lib/utils/ai';
import { APPS, EMBED_BASE_URL } from '../../lib/utils/embedUrls';
import { ChatCompletionMessageParam } from 'openai/src/resources/index.js';

const functions = [
  {
    name: 'embedApp',
    description: 'Embed a blockchain app in the chat interface',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to embed',
        },
        appName: {
          type: 'string',
          description: 'The name of the app being embedded',
        },
      },
      required: ['url', 'appName'],
    },
  },
];

const systemPrompt = `You are an expert cross-chain DeFi assistant that helps users navigate and trade across Flow, Base, and Arbitrum blockchains.

AVAILABLE TRADING PLATFORMS:
Arbitrum:
- Uniswap: Default choice, best liquidity, familiar interface
- CoW Swap: MEV protection, better prices through batch auctions

Base:
- Uniswap: Primary DEX, high liquidity, optimized for Base
- CoW Swap: Advanced trading with MEV protection

Flow:
- Increment: Native Flow DEX, specialized for Flow ecosystem

INTERACTION RULES:
1. When users mention a specific chain but no DEX:
   - For Arbitrum → Default to Uniswap (most liquid)
   - For Base → Default to Uniswap (optimized experience)
   - For Flow → Use Increment (native DEX)

2. When users mention trading but no specifics:
   - Ask which chain they prefer
   - Explain differences in:
     * Gas fees (Base/Arbitrum vs Flow)
     * Transaction speed
     * Available tokens

3. Always provide context about:
   - Required wallet setup (MetaMask for Base/Arbitrum, Flow wallet for Flow)
   - Expected gas fees per chain
   - Bridge recommendations if needed

4. Guide users through the process:
   - Wallet connection steps
   - Token selection
   - Cross-chain considerations
   - Safety checks

Be concise but informative, and always prioritize user security and optimal trading routes.`;

// First, let's define the chain types at the top of the file
type SupportedChain = 'arbitrum' | 'base' | 'flow';

// Update the extractTokenAddress function to be more specific
const extractTokenAddress = (message: string): string | undefined => {
  // Match Ethereum-style (Base/Arbitrum) or Flow addresses
  const addressRegex = /(0x[a-fA-F0-9]{40})|([A-Z0-9a-z.]{5,64})/;
  const match = message.match(addressRegex);
  return match?.[0];
};

// Update the getAppUrl function to use type safety
const getAppUrl = (message: string) => {
  const msg = message.toLowerCase();
  const tokenAddress = extractTokenAddress(message);
  
  // Check for specific DEX mentions
  if (msg.includes('uniswap')) {
    const chain = msg.includes('arbitrum') ? 'arbitrum' : 'base';
    return {
      url: `https://app.poink.xyz/ethglobal/${chain}${tokenAddress ? `?token=${tokenAddress}` : ''}`,
      text: `I'll help you trade${tokenAddress ? ' this token' : ''} on Uniswap (${chain.charAt(0).toUpperCase() + chain.slice(1)})!

1. Connect MetaMask or any EVM wallet
2. Gas fees are much lower than Ethereum mainnet
3. Ensure you're on the ${chain} network

${tokenAddress ? "I've pre-loaded your token. " : ""}What would you like to do next?`
    };
  }
  
  if (msg.includes('cowswap')) {
    const chain = msg.includes('arbitrum') ? 'arbitrum' : 'base';
    return {
      url: `https://app.poink.xyz/ethglobal/${chain}/cowswap${tokenAddress ? `?token=${tokenAddress}` : ''}`,
      text: `Loading CoW Swap on ${chain}! Benefits include:
1. MEV protection
2. Better prices through batch auctions
3. Gasless orders

${tokenAddress ? "Your token is pre-loaded. " : ""}Ready to connect your wallet?`
    };
  }
  
  if (msg.includes('increment') || msg.includes('flow')) {
    return {
      url: `https://app.poink.xyz/ethglobal/flow${tokenAddress ? `?token=${tokenAddress}` : ''}`,
      text: `Opening Increment on Flow! Important info:
1. Connect your Flow wallet
2. Transaction fees are minimal
3. Native Flow token support

${tokenAddress ? "I've set up the token pair. " : ""}Ready to trade on Flow?`
    };
  }

  // Chain-specific requests with token
  if (tokenAddress) {
    if (tokenAddress.startsWith('0x')) {
      const chain = msg.includes('arbitrum') ? 'arbitrum' : 'base';
      return {
        url: `https://app.poink.xyz/ethglobal/${chain}?token=${tokenAddress}`,
        text: `I see you want to trade on ${chain}! I've loaded Uniswap with your token.

Would you like to:
- Proceed with the trade
- Check token details
- Try CoW Swap instead?`
      };
    } else {
      return {
        url: `https://app.poink.xyz/ethglobal/flow?token=${tokenAddress}`,
        text: `I see you're interested in trading on Flow! I've loaded Increment with your token.

Would you like to:
- Start trading
- Verify token details
- Learn more about Flow DeFi?`
      };
    }
  }

  // Chain-specific requests
  if (msg.includes('arbitrum')) {
    return {
      url: 'https://app.poink.xyz/ethglobal/arbitrum',
      text: `I've set up Uniswap on Arbitrum for you.

Quick setup:
1. Connect MetaMask to Arbitrum
2. Gas fees are ~$0.25-1.00
3. Full Ethereum ecosystem access

What would you like to trade?`
    };
  }

  if (msg.includes('base')) {
    return {
      url: 'https://app.poink.xyz/ethglobal/base',
      text: `Loading Uniswap on Base.

Getting started:
1. Connect MetaMask to Base
2. Very low gas fees (~$0.10)
3. Growing ecosystem

Ready to start trading?`
    };
  }

  if (msg.includes('chat')) {
    return {
      url: 'https://app.poink.xyz/embed?url=https%3A%2F%2Fpoink-chat-ethglobal.vercel.app',
      text: `Opening our Web3 chat interface! Here you can:
1. Connect with other traders
2. Get real-time market insights
3. Share trading strategies

Ready to join the conversation?`
    };
  }

  // Generic trading intent
  if (msg.includes('trade') || msg.includes('swap') || msg.includes('exchange')) {
    return {
      url: 'https://app.poink.xyz/ethglobal',
      text: `I can help you trade! Which chain would you prefer?

Arbitrum:
+ Fast transactions (~$0.25-1.00 gas)
+ Full Ethereum ecosystem
+ Uniswap and CoW Swap available

Base:
+ Very low fees (~$0.10)
+ Growing ecosystem
+ Optimized performance

Flow:
+ Native blockchain experience
+ Minimal transaction fees
+ Unique token ecosystem

Let me know your preference, and I'll help you get started!`
    };
  }

  // Default welcome response (gm)
  return {
    url: 'https://app.poink.xyz/ethglobal',
    text: `Welcome! I'm your cross-chain DeFi assistant. I can help you trade on:

1. Arbitrum
   - Fast transactions, low fees
   - Uniswap and CoW Swap available

2. Base
   - Optimized for efficiency
   - Growing ecosystem

3. Flow
   - Native blockchain experience
   - Unique token ecosystem

Which chain interests you? I'll help you get started!`
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    console.log('Received message:', message);

    const { url, text } = getAppUrl(message);
    console.log('App URL:', url);

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    const stream = await createCompletion(messages, {
      functions,
      function_call: {
        name: 'embedApp',
        arguments: JSON.stringify({
          url,
          appName: 'App'
        })
      }
    });

    // Send as a single response object
    const response = {
      id: Date.now().toString(),
      role: 'assistant',
      content: text,
      timestamp: Date.now(),
      function_call: {
        name: 'embedApp',
        arguments: JSON.stringify({
          url,
          appName: 'App'
        })
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 