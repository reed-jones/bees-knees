const workspace = document.getElementById('workspace') as HTMLElement
const number_of_bees = 10

// div generation helper
let makeDiv = (baseClass: string) => {
  let tmp = document.createElement('div')
  tmp.className = baseClass
  return tmp
}

// bee class
class Bee {
  beeNode: HTMLElement
  maxX: number
  minX: number
  maxY: number
  minY: number
  translateX: number
  translateY: number
  rotation: number
  timer: number
  speed: number
  constructor(bee: HTMLElement, workspace: HTMLElement) {
    this.beeNode = bee
    this.maxX = workspace.clientWidth - 75
    this.minX = 20
    this.maxY = workspace.clientHeight - 75
    this.minY = 20
    this.translateX = Math.random() * this.maxX
    this.translateY = Math.random() * this.maxY
    this.rotation = Math.random() * 360
    this.speed = 0
    this.createBee()
  }
  private createBee() {
    // create head
    this.beeNode.appendChild(makeDiv('bee-head'))

    // create body
    let body = makeDiv('bee-body')
    body.appendChild(makeDiv('bee-wing-left'))
    body.appendChild(makeDiv('bee-wing-right'))
    this.beeNode.appendChild(body)

    // set initial position
    this.transform()

    // display finalized bee
    this.beeNode.style.display = 'block'
  }
  private move(s: number, r: number) {
    this.stop()
    // set random bee fast speed
    this.speed = Math.random() * s

    //
    this.timer = window.setInterval(() => {
      this.rotation += Math.random() * r - r / 2

      this.calculatePosition()

      this.checkWallCollisions()

      this.transform()
    }, 150)
  }
  private calculatePosition() {
    let rad = (this.rotation - 90) * (Math.PI / 180)

    this.translateX = Math.min(
      Math.max(this.translateX + this.speed * Math.cos(rad), this.minX),
      this.maxX,
    )

    this.translateY = Math.min(
      Math.max(this.translateY + this.speed * Math.sin(rad), this.minY),
      this.maxY,
    )
  }
  private transform() {
    this.beeNode.style.transform =
      'translate(' +
      this.translateX +
      'px, ' +
      this.translateY +
      'px) rotate(' +
      this.rotation +
      'deg)'
  }
  private checkWallCollisions() {
    if (
      this.translateX == this.minX ||
      this.translateY == this.minY ||
      this.translateX == this.maxX ||
      this.translateY == this.maxY
    ) {
      this.rotation += 90
    }
  }
  public stop() {
    clearInterval(this.timer)
  }
  public go() {
    let fast = Math.random() * 2000 + 2000
    let slow = Math.random() * 2000 + 1000
    this.move(50, 30)
    window.setInterval(() => {
      this.FastMove(slow, 5, 70).then(() => this.FastMove(fast, 50, 30))
    }, fast + slow)
  }
  public async FastMove(t: number, s: number, r: number) {
    await this.delay(t, s, r)
  }
  private async delay(milliseconds: number, s: number, r: number) {
    this.move(s, r)

    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, milliseconds)
    })
  }
}

let bees = []
// generate bees
for (var i = 0; i < number_of_bees; ++i) {
  let tmp = makeDiv('bee')
  workspace.appendChild(tmp)
  bees.push(tmp)
}

// let them buzz
for (var i = 0; i < bees.length; ++i) {
  let b = bees[i] as HTMLElement
  let t = new Bee(b, workspace)
  t.go()
}
