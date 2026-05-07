import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import cliente from '../api/cliente'
import '../paginas/Auth.css'

const getSeries      = (re) => re.pivot?.series       ?? re.series       ?? 0
const getReps        = (re) => re.pivot?.repeticiones ?? re.repeticiones ?? 0
const getDescanso    = (re) => re.pivot?.descanso_seg ?? re.descanso_seg ?? 60
const getNotas       = (re) => re.pivot?.notas        ?? re.notas        ?? ''
const getNombre      = (re) => re.ejercicio?.nombre   ?? re.nombre       ?? '—'
const getGrupo       = (re) => re.ejercicio?.grupo_muscular ?? re.grupo_muscular ?? ''
const getGif         = (re) => re.ejercicio?.url_gif  ?? re.url_gif      ?? null
const getEjercicioId = (re) => re.ejercicio?.id       ?? re.ejercicio_id ?? re.id

/* ── Modal añadir ejercicio ───────────────────────── */
function ModalEjercicio({ rutinaId, alAgregar, alCerrar }) {
  const [ejercicios,       setEjercicios]       = useState([])
  const [gruposMusculares, setGruposMusculares] = useState([])
  const [buscar,           setBuscar]           = useState('')
  const [grupo,            setGrupo]            = useState('')
  const [seleccionado,     setSeleccionado]     = useState(null)
  const [series,           setSeries]           = useState(3)
  const [repeticiones,     setRepeticiones]     = useState(10)
  const [descanso,         setDescanso]         = useState(60)
  const [notas,            setNotas]            = useState('')
  const [cargando,         setCargando]         = useState(false)

  useEffect(() => {
    cliente.get('/ejercicios/grupos').then(res => setGruposMusculares(res.data))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const params = { per_page: 20 }
      if (buscar) params.buscar = buscar
      if (grupo)  params.grupo_muscular = grupo
      cliente.get('/ejercicios', { params })
        .then(res => setEjercicios(res.data.data ?? res.data))
    }, 300)
    return () => clearTimeout(t)
  }, [buscar, grupo])

  const manejarAgregar = async () => {
    if (!seleccionado) return
    setCargando(true)
    try {
      await cliente.post(`/rutinas/${rutinaId}/ejercicios`, {
        ejercicio_id: seleccionado.id,
        series, repeticiones, descanso_seg: descanso, notas,
      })
      alAgregar({
        id:             seleccionado.id,
        nombre:         seleccionado.nombre,
        grupo_muscular: seleccionado.grupo_muscular,
        url_gif:        seleccionado.url_gif,
        pivot:          { series, repeticiones, descanso_seg: descanso, notas },
        _key:           Date.now(),
      })
      alCerrar()
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && alCerrar()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-titulo">AÑADIR EJERCICIO</h3>
          <button className="modal-cerrar" onClick={alCerrar}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-filtros">
            <input
              className="r-input"
              placeholder="Buscar ejercicio..."
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
              autoFocus
            />
            <select
              className="cat-select"
              value={grupo}
              onChange={e => setGrupo(e.target.value)}
              style={{ minWidth: 0, width: '160px' }}
            >
              <option value="">Todos</option>
              {gruposMusculares.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="modal-ej-lista">
            {ejercicios.length === 0 ? (
              <p style={{ padding: '1rem', color: 'var(--auth-muted)', fontSize: '0.82rem', textAlign: 'center' }}>
                Sin resultados
              </p>
            ) : ejercicios.map(ej => (
              <button
                key={ej.id}
                className={`modal-ej-item${seleccionado?.id === ej.id ? ' seleccionado' : ''}`}
                onClick={() => setSeleccionado(ej)}
              >
                {ej.url_gif && (
                  <img src={ej.url_gif} alt="" style={{ width: 36, height: 36, objectFit: 'contain', background: '#111', borderRadius: 4 }} />
                )}
                <div>
                  <p className="modal-ej-item-nombre">{ej.nombre}</p>
                  <p className="modal-ej-item-grupo">{ej.grupo_muscular}</p>
                </div>
              </button>
            ))}
          </div>

          {seleccionado && (
            <>
              <div className="modal-series-grid">
                {[
                  ['Series',       series,       setSeries,       1,  20],
                  ['Repeticiones', repeticiones, setRepeticiones, 1, 100],
                  ['Descanso (s)', descanso,     setDescanso,     0, 600],
                ].map(([label, val, setter, min, max]) => (
                  <div key={label}>
                    <label className="r-label">{label}</label>
                    <input
                      type="number" className="r-input-num"
                      value={val} min={min} max={max}
                      onChange={e => setter(Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="r-label">Notas (opcional)</label>
                <input
                  className="r-input"
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                  placeholder="Ej: peso máximo, técnica especial..."
                />
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="r-btn"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={manejarAgregar}
            disabled={!seleccionado || cargando}
          >
            {cargando ? 'Añadiendo...' : '+ Añadir a la rutina'}
          </button>
          <button className="r-btn-sec" onClick={alCerrar}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

/* ── Fila de ejercicio con edición inline ─────────── */
function FilaEjercicio({ re, numero, rutinaId, alQuitar, alActualizar }) {
  const [editando,     setEditando]     = useState(false)
  const [series,       setSeries]       = useState(getSeries(re))
  const [repeticiones, setRepeticiones] = useState(getReps(re))
  const [descanso,     setDescanso]     = useState(getDescanso(re))
  const [notas,        setNotas]        = useState(getNotas(re))
  const [guardando,    setGuardando]    = useState(false)

  const guardar = async () => {
    setGuardando(true)
    try {
      await cliente.put(`/rutinas/${rutinaId}/ejercicios/${getEjercicioId(re)}`, {
        series, repeticiones, descanso_seg: descanso, notas,
      })
      alActualizar(re.id, { series, repeticiones, descanso_seg: descanso, notas })
    } catch (e) {
      console.error('Error al guardar:', e)
    } finally {
      setGuardando(false)
      setEditando(false)
    }
  }

  const cancelar = () => {
    setSeries(getSeries(re))
    setRepeticiones(getReps(re))
    setDescanso(getDescanso(re))
    setNotas(getNotas(re))
    setEditando(false)
  }

  const notasActuales = getNotas(re)

  return (
    <div className="ej-fila">
      <div className="ej-fila-principal">
        <span className="ej-num">{numero}</span>

        {getGif(re) ? (
          <img src={getGif(re)} alt="" className="ej-gif" />
        ) : (
          <div className="ej-gif-placeholder">
            {getNombre(re).slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="ej-info">
          <p className="ej-nombre">{getNombre(re)}</p>
          <div className="ej-chips">
            {getGrupo(re) && <span className="ej-chip ej-chip-accent">{getGrupo(re)}</span>}
            <span className="ej-chip">{getSeries(re)}×{getReps(re)}</span>
            <span className="ej-chip">{getDescanso(re)}s</span>
          </div>
          {notasActuales && (
            <p className="ej-notas">{notasActuales}</p>
          )}
        </div>

        <div className="ej-acciones">
          <button className="ej-btn-icon" title="Editar" onClick={() => setEditando(v => !v)}>✎</button>
          <button className="ej-btn-icon danger" title="Quitar" onClick={() => alQuitar(re.id)}>✕</button>
        </div>
      </div>

      {editando && (
        <div className="ej-edit-panel">
          {[
            ['Series',       series,       setSeries,       1,  20],
            ['Repeticiones', repeticiones, setRepeticiones, 1, 100],
            ['Descanso (s)', descanso,     setDescanso,     0, 600],
          ].map(([label, val, setter, min, max]) => (
            <div key={label}>
              <label className="r-label">{label}</label>
              <input
                type="number" className="r-input-num"
                value={val} min={min} max={max}
                onChange={e => setter(Number(e.target.value))}
              />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="r-label">Notas</label>
            <input
              className="r-input"
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Ej: peso máximo, técnica especial..."
            />
          </div>
          <div className="ej-edit-actions">
            <button className="r-btn-sec" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }} onClick={cancelar}>
              Cancelar
            </button>
            <button className="r-btn" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }} onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Página principal ─────────────────────────────── */
export default function DetalleRutina() {
  const { id }  = useParams()
  const navegar = useNavigate()
  const [rutina,       setRutina]       = useState(null)
  const [cargando,     setCargando]     = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    cliente.get(`/rutinas/${id}`)
      .then(res => setRutina(res.data))
      .finally(() => setCargando(false))
  }, [id])

  const alQuitar = async (ejercicioId) => {
    if (!confirm('¿Quitar este ejercicio de la rutina?')) return
    await cliente.delete(`/rutinas/${id}/ejercicios/${ejercicioId}`)
    setRutina(prev => ({ ...prev, ejercicios: prev.ejercicios.filter(e => e.id !== ejercicioId) }))
  }

  const alActualizar = (ejercicioId, datos) => {
    setRutina(prev => ({
      ...prev,
      ejercicios: prev.ejercicios.map(e =>
        e.id === ejercicioId
          ? { ...e, pivot: { ...e.pivot, ...datos }, ...datos }
          : e
      )
    }))
  }

  const alAgregar = (re) => {
    setRutina(prev => ({ ...prev, ejercicios: [...prev.ejercicios, re] }))
  }

  const eliminarRutina = async () => {
    if (!confirm('¿Eliminar esta rutina permanentemente?')) return
    await cliente.delete(`/rutinas/${id}`)
    navegar('/mis-rutinas')
  }

  if (cargando) return (
    <div className="cat-spinner" style={{ paddingTop: '6rem' }}>
      <div className="cat-spinner-ring" />
    </div>
  )

  if (!rutina) return (
    <div className="page-wrap-sm" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <p style={{ color: 'var(--auth-muted)', marginBottom: '1rem' }}>Rutina no encontrada.</p>
      <Link to="/mis-rutinas" className="det-back">← Volver</Link>
    </div>
  )

  return (
    <div className="page-wrap-sm">
      <Link to="/mis-rutinas" className="det-back">← Mis rutinas</Link>

      <div className="det-rutina-header">
        <div>
          <h1 className="det-rutina-nombre">{rutina.nombre}</h1>
          {rutina.descripcion && <p className="det-rutina-desc">{rutina.descripcion}</p>}
        </div>
        <button className="r-btn-danger" onClick={eliminarRutina}>Eliminar rutina</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {rutina.ejercicios.length === 0 ? (
          <div className="estado-vacio">
            <span className="estado-vacio-num">0</span>
            <p>Esta rutina no tiene ejercicios todavía.</p>
          </div>
        ) : rutina.ejercicios.map((re, i) => (
          <FilaEjercicio
            key={re._key ?? re.id}
            re={re}
            numero={i + 1}
            rutinaId={id}
            alQuitar={alQuitar}
            alActualizar={alActualizar}
          />
        ))}
      </div>

      <button
        className="r-btn"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => setMostrarModal(true)}
      >
        + Añadir ejercicio
      </button>

      {mostrarModal && (
        <ModalEjercicio
          rutinaId={id}
          alAgregar={alAgregar}
          alCerrar={() => setMostrarModal(false)}
        />
      )}
    </div>
  )
}