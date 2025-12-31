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

// Request local media, show preview, and add to the peer
const testBtn = document.querySelector('#testclick')
testBtn.addEventListener('click', async ev => {
  ev.preventDefault()
  const constraints = { video: true, audio: true }
  try {
    const stream = await window.navigator.mediaDevices.getUserMedia(constraints)

    // show local preview (will be replaced if remote stream arrives)
    const video = document.querySelector('video')
    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream)
    }
    video.muted = true
    try { await video.play() } catch {}

    // add stream to the peer (fallback to addTrack if addStream unavailable)
    if (typeof p.addStream === 'function') {
      p.addStream(stream)
    } else if (typeof p.addTrack === 'function') {
      stream.getTracks().forEach(track => p.addTrack(track, stream))
    }

    console.log('Local media acquired and added to peer')
  } catch (err) {
    console.error('getUserMedia error', err)
    alert('getUserMedia error: ' + (err && err.message ? err.message : err))
  }
})