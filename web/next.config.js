module.exports = async (phase, { defaultConfig }) => {
  const appDefaults = {
    webpack: (config) => {
      config.watchOptions.poll = 300;
      return config;
    },
  };

  console.log(`HOST=${process.env.HOST}`);

  switch (process.env.HOST) {
    case 'localhost':
      return {
        ...appDefaults,
        async rewrites() {
          return [
            {
              source: '/api/:path*',
              destination: 'http://ticketingms.dev/api/:path*',
            },
          ];
        },
      };
    default:
      return {
        ...appDefaults,
      };
  }
};
