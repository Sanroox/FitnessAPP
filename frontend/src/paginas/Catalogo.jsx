import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import cliente from '../api/cliente'
import TarjetaEjercicio from '../componentes/TarjetaEjercicio'
import '../paginas/Auth.css'

export default function Catalogo() {
  const [ejercicios,       setEjercicios]       = useState([])
  const [gruposMusculares, setGruposMusculares] = useState([])
  const [cargando,         setCargando]         = useState(true)
  const [paginacion,       setPaginacion]       = useState(null)

  const [filtros, setFiltros] = useState({
    buscar:         '',
    grupo_muscular: '',
    pagina:         1,
  })

  const obtenerEjercicios = useCallback(async () => {
    setCargando(true)
    try {
      const params = { page: filtros.pagina }
      if (filtros.buscar)         params.buscar         = filtros.buscar
      if (filtros.grupo_muscular) params.grupo_muscular = filtros.grupo_muscular
      const res = await cliente.get('/ejercicios', { params })
      setEjercicios(res.data.data)
      setPaginacion(res.data)
    } finally {
      setCargando(false)
    }
  }, [filtros])

  useEffect(() => { obtenerEjercicios() }, [obtenerEjercicios])

  useEffect(() => {
    cliente.get('/ejercicios/grupos').then(res => setGruposMusculares(res.data))
  }, [])

  const manejarBusqueda = (e) => {
    e.preventDefault()
    setFiltros(f => ({ ...f, pagina: 1 }))
  }

  return (
    <div className="cat-wrap">

      <div className="cat-header">
        <h1 className="cat-titulo">CATÁLOGO DE <em>EJERCICIOS</em></h1>
        <p className="cat-subtitulo">Encuentra y explora todos los movimientos disponibles</p>
      </div>

      {/* Filtros */}
      <div className="cat-filtros">
        <form onSubmit={manejarBusqueda} className="cat-search-wrap">
          <input
            className="cat-input"
            placeholder="Buscar ejercicio..."
            value={filtros.buscar}
            onChange={e => setFiltros(f => ({ ...f, buscar: e.target.value }))}
          />
          <button type="submit" className="cat-btn-buscar">Buscar</button>
        </form>

        <select
          className="cat-select"
          value={filtros.grupo_muscular}
          onChange={e => setFiltros(f => ({ ...f, grupo_muscular: e.target.value, pagina: 1 }))}
        >
          <option value="">Todos los músculos</option>
          {gruposMusculares.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Contenido */}
      {cargando ? (
        <div className="cat-spinner">
          <div className="cat-spinner-ring" />
        </div>
      ) : ejercicios.length === 0 ? (
        <div className="cat-vacio">
          <span className="cat-vacio-icono">404</span>
          <p>No se encontraron ejercicios con esos filtros.</p>
        </div>
      ) : (
        <>
          <div className="cat-grid">
            {ejercicios.map(ej => (
              <TarjetaEjercicio key={ej.id} ejercicio={ej} />
            ))}
          </div>

          {paginacion && paginacion.last_page > 1 && (
            <div className="cat-paginacion">
              <button
                className="cat-btn-pag"
                disabled={filtros.pagina <= 1}
                onClick={() => setFiltros(f => ({ ...f, pagina: f.pagina - 1 }))}
              >
                ← Anterior
              </button>
              <span className="cat-pagina-info">
                Página {paginacion.current_page} de {paginacion.last_page}
              </span>
              <button
                className="cat-btn-pag"
                disabled={filtros.pagina >= paginacion.last_page}
                onClick={() => setFiltros(f => ({ ...f, pagina: f.pagina + 1 }))}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}