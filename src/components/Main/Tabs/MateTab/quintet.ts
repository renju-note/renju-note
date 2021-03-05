/* eslint-disable */
// https://github.com/webpack-contrib/worker-loader/issues/176
const ctx: Worker = self as any

// Post data to parent thread
ctx.postMessage({ foo: 'foo' })

// Respond to message from parent thread
ctx.addEventListener('message', event => console.log(event))

export default {}
