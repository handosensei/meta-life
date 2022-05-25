const urlParams = new URLSearchParams(window.location.search);

const handleClick = () => {
  window.addEventListener('keyup', ({ key }) => {
    if (key === 'ArrowDown') {
      window.canvas.props.target += 1;
      if (window.canvas.props.target > 7) window.canvas.props.target = 0;
    }
    if (key === 'ArrowUp') {
      window.canvas.props.target -= 1;
      if (window.canvas.props.target < 0) window.canvas.props.target = 7;
    }
  });
};
(async () => {
  if (urlParams.get('dev') !== null) {
    await require('~/lib/gui');
  }
  if (true || process.env.VERCEL || process.env.NETLIFY) {
    const PasswordScreen = await require('~/lib/dev/PasswordScreen').default;
    let psScreen = new PasswordScreen({
      options: {
        handleSuccess: async () => {
          psScreen.props.state = 'loader';
          const Canvas = await require('~/imog/Canvas').default;
          window.canvas = new Canvas({
            options: {
              handleItemLoaded: (a) => psScreen.itemLoaded(a),
              handleReady: () => {
                if (!psScreen) return;
                psScreen.destroy();
                psScreen = null;
                handleClick();
              },
            },
          });
        },
      },
    });
  } else {
    const Canvas = await require('~/imog/Canvas').default;
    window.canvas = new Canvas({
      options: {
        handleReady: () => {
          handleClick();
        },
      },
    });
  }
})();
