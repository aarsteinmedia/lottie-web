# AM Lottie Web
This is a modified version of Airbnb's [lottie-web](https://github.com/airbnb/lottie-web), made to adress the following issues:
- Safer and more efficient handling of After Effects expressions. This codebase does not rely on `eval` to execute expressions made with After Effects, making it safer and also slightly faster.
- Server Side Rendering in Node environments. All calls to browser or Web API are wrapped in environment checks.
- Better error handling. A big problem with the original codebase was that it would fail silently. This made development and user feedback difficult.

This package is primarily made to work with [`@aarsteinmedia/dotlottie-player`](https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player), and [`@aarsteinmedia/dotlottie-react`](https://www.npmjs.com/package/@aarsteinmedia/dotlottie-react). Any use cases outside of that are incidental and due to inherited features of `airbnb/lottie-web`.