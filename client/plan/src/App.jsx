import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {

  const [mouseElem, setMouseElem] = useState({ elem: {}, x: 0, y: 0 })
  const [placedItems, setPlacedItems] = useState([])

  useEffect(() => {
    document.onmouseup = (e) => {
      if (e.target.className === 'map') return
      setMouseElem(prev => { return { ...prev, elem: {} } })
    }

    return () => {
      document.onmouseup = null
    }
  }, [])

  function handleMouseDown(e) {
    if (e.button === 2) return
    setMouseElem(prev => { return { ...prev, elem: { type: e.target.className, size: { width: e.target.offsetWidth, height: e.target.offsetHeight } } } })
  }

  function handleMouseMove(e) {
    setMouseElem(prev => { return { ...prev, x: e.pageX, y: e.pageY } })
  }

  function handleMapUp(e) {
    if (mouseElem.elem.type) {
      const x = e.nativeEvent.offsetX
      const y = e.nativeEvent.offsetY
      setPlacedItems(prev => {
        prev.push({
          id: Math.random(),
          type: mouseElem.elem.type,
          x: x - (mouseElem.elem.size.width * 0.5),
          y: y - (mouseElem.elem.size.height * 0.5)
        })
        return [...prev]
      })
      setMouseElem(prev => { return { ...prev, elem: {} } })
    }
  }

  function handleDelete(itemId) {
    setPlacedItems(prev => {
      const items = [...prev]
      items.splice(items.findIndex(item => item.id === itemId), 1)
      return items
    })
  }

  async function handleSave() {
    const data = (await axios.post('http://localhost:3000/requestJSON', placedItems)).data
    if (data.type !== 'success') return
    window.open(`http://localhost:3000/download/${data.name}`)
  }

  function handleFile(e) {
    const file = e.target.files[0]

    const reader = new FileReader()

    reader.onload = () => {
      const placed = JSON.parse(reader.result)
      setPlacedItems(placed)
    }

    reader.readAsText(file)
  }


  return (
    <div className="app" onMouseMove={handleMouseMove}>
      <span style={{ position: 'absolute', top: mouseElem.y, left: mouseElem.x, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} className={mouseElem.elem.type}></span>

      <div className="menu">
        <h1>Доступные элементы</h1>
        <div className="items-list">
          <div className="item">
            <div onMouseDown={handleMouseDown} className="small-rect-table"></div>
            <div className="item-label">Малый кв. стол</div>
          </div>
          <div className="item">
            <div onMouseDown={handleMouseDown} className="big-rect-table"></div>
            <div className="item-label">Большой кв. стол</div>
          </div>
          <div className="item">
            <div onMouseDown={handleMouseDown} className="small-rounded-table"></div>
            <div className="item-label">Малый круглый стол</div>
          </div>
          <div className="item">
            <div onMouseDown={handleMouseDown} className="big-rounded-table"></div>
            <div className="item-label">Большой круглый стол</div>
          </div>
          <div className="item">
            <div onMouseDown={handleMouseDown} className="chair"></div>
            <div className="item-label">Место</div>
          </div>
        </div>
        <div className="buttons">
          <button onClick={handleSave} className="save">Сохранить</button>
          <label className="import">Импортировать <input onChange={handleFile} type='file' className='hidden'/></label>
        </div>
      </div>
      <div>
        <h1>Карта заведения</h1>
        <div onMouseUp={handleMapUp} className="map">
          {placedItems.map((item) => {
            return <div onContextMenu={(e) => { e.preventDefault(); handleDelete(item.id) }} onMouseDown={(e) => { if (e.button === 2) { e.preventDefault(); return }; handleDelete(item.id); handleMouseDown(e) }} key={item.id} className={item.type} style={{ position: 'absolute', top: item.y, left: item.x }}></div>
          })}
        </div>
      </div>
    </div>
  )
}

export default App
