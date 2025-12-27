import SimplePeer from '@thaunknown/simple-peer'

// Expose to window for debugging in console
if (typeof window !== 'undefined') window.SimplePeer = SimplePeer

const p = new SimplePeer({
  initiator: location.hash === '#1',
  trickle: false
})

p.on('error', err => console.log('error', err))

p.on('signal', data => {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
})

document.querySelector('form').addEventListener('submit', ev => {
  ev.preventDefault()
  try {
    const val = JSON.parse(document.querySelector('#incoming').value)
    p.signal(val)
  } catch (e) {
    alert('Invalid JSON')
  }
})

p.on('connect', () => {
  console.log('CONNECT')
  p.send('hello ' + Math.random())
})

p.on('data', data => {
  console.log('data: ' + data)
  alert('Received: ' + data)
})

p.on('stream', stream => {
  // got remote video stream, now let's show it in a video tag
  var video = document.querySelector('video')

  if ('srcObject' in video) {
    video.srcObject = stream
  } else {
    video.src = window.URL.createObjectURL(stream) // for older browsers
  }

  video.play()
})

function myFunction() {
  window.navigator.mediaDevices.getUserMedia(constraints)
}