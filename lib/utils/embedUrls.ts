export const EMBED_BASE_URL = 'https://app.poink.xyz';

export const APPS = {
  monad: {
    nadfun: {
      url: `${EMBED_BASE_URL}/embed?url=https://devnet.nad.fun/`,
      keywords: ['nadfun', 'nad fun', 'fun'],
    },
    breakmonad: {
      url: `${EMBED_BASE_URL}/embed?url=https://devnet.nad.fun/`,
      keywords: ['break', 'break monad'],
    },
    purgenad: {
      url: 'https://purgednads.vercel.app/',
      keywords: ['purge', 'purgenad'],
    },
    nadrunner: {
      url: 'https://nadrunner.vercel.app/',
      keywords: ['run', 'runner', 'nad runner'],
    },
    yapmonad: {
      url: 'https://yapmonad.xyz/',
      keywords: ['yap', 'yap monad'],
    },
    gmonad: {
      url: 'https://gmonad.club/',
      keywords: ['gmonad', 'g monad'],
    },
  },
  ethereum: {
    uniswap: {
      baseUrl: 'https://app.uniswap.org/#/swap',
      keywords: ['swap', 'uniswap', 'trade', 'exchange'],
      description: "Uniswap is one of the most popular decentralized exchanges on Ethereum.",
      buildUrl: (tokenAddress?: string) => {
        if (tokenAddress) {
          return `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${tokenAddress}`;
        }
        return 'https://app.uniswap.org/#/swap';
      }
    },
    cowswap: {
      baseUrl: 'https://swap.cow.fi/#/1/swap/ETH',
      keywords: ['cow', 'cowswap', 'cow swap'],
      description: "CoW Swap offers MEV-protected trades with better prices on Ethereum.",
      buildUrl: (tokenAddress?: string) => {
        if (tokenAddress) {
          return `https://swap.cow.fi/#/1/swap/ETH/${tokenAddress}`;
        }
        return 'https://swap.cow.fi/#/1/swap/ETH';
      }
    },
  },
  solana: {
    jupiter: {
      baseUrl: 'https://jup.ag/swap',
      keywords: ['jupiter', 'jup', 'jup.ag'],
      description: "Jupiter is the key liquidity aggregator for Solana.",
      buildUrl: (tokenAddress?: string) => {
        if (tokenAddress) {
          return `https://jup.ag/swap/SOL-${tokenAddress}`;
        }
        return 'https://jup.ag/swap';
      }
    },
    raydium: {
      baseUrl: 'https://raydium.io/swap',
      keywords: ['raydium', 'ray'],
      description: "Raydium is a leading AMM on Solana.",
      buildUrl: (tokenAddress?: string) => {
        if (tokenAddress) {
          return `https://raydium.io/swap?inputMint=sol&outputMint=${tokenAddress}`;
        }
        return 'https://raydium.io/swap';
      }
    },
  },
} as const;

export function getEmbedUrl(url: string): string {
  return `${EMBED_BASE_URL}/embed?url=${encodeURIComponent(url)}`;
} 