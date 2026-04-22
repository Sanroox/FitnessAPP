import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProveedorAuth } from './contexto/ContextoAuth'
import RutaProtegida  from './componentes/RutaProtegida'
import RutaAdmin      from './componentes/RutaAdmin'
import RutaInvitado   from './componentes/RutaInvitado'
import BarraNavegacion from './componentes/BarraNavegacion'

import InicioSesion       from './paginas/InicioSesion'
import Registro           from './paginas/Registro'
import Catalogo           from './paginas/Catalogo'
import DetalleEjercicio   from './paginas/DetalleEjercicio'
/* Importaciones comentadas para el futuro...
import PanelPrincipal     from './paginas/PanelPrincipal'
import MisRutinas         from './paginas/MisRutinas'
import DetalleRutina      from './paginas/DetalleRutina'
import CrearRutina        from './paginas/CrearRutina'
import PanelAdmin         from './paginas/PanelAdmin'
*/

export default function Aplicacion() {
  return (
    <BrowserRouter>
      <ProveedorAuth>
        <div className="min-h-screen flex flex-col">
          <BarraNavegacion />
          <main className="flex-1">
            <Routes>
              
              {/* 2. RUTAS PÚBLICAS RESTRINGIDAS: Envueltas en RutaInvitado para que no entren los que ya tienen sesión */}
              <Route 
                path="/inicio-sesion" 
                element={
                  <RutaInvitado>
                    <InicioSesion />
                  </RutaInvitado>
                } 
              />
              <Route 
                path="/registro"      
                element={
                  <RutaInvitado>
                    <Registro />
                  </RutaInvitado>
                } 
              />

              <Route path="/catalogo/:id"             element={<DetalleEjercicio />} />
              <Route path="/catalogo"                 element={<Catalogo />} />
              {/* 3. RUTAS PROTEGIDAS (Descomentar esto cuando esten las páginas) */}
              {/* <Route element={<RutaProtegida />}>
                <Route path="/"                         element={<PanelPrincipal />} />
                <Route path="/mis-rutinas"              element={<MisRutinas />} />
                <Route path="/mis-rutinas/nueva"        element={<CrearRutina />} />
                <Route path="/mis-rutinas/:id"          element={<DetalleRutina />} />
              </Route> */}

              {/* Rutas de administración */}
              {/* <Route element={<RutaAdmin />}>
                <Route path="/panel-admin" element={<PanelAdmin />} />
              </Route> */}

              {/* 4. SOLUCIÓN AL BUCLE Y REDIRECCIÓN RAÍZ */}
              {/* Como la ruta "/" real está comentada arriba temporalmente, 
                  si el usuario va a localhost:5173/ lo mandamos al login de forma segura. 
                  (Cuando descomentes el bloque de arriba, puedes borrar esta línea) 
              <Route path="/" element={<Navigate to="/inicio-sesion" replace />} />
*/}
              {/* 5. CATCH-ALL: Cualquier URL inventada se va a la raíz (que ahora es segura) */}
              <Route path="*" element={<Navigate to="/" replace />} />
              
            </Routes>
          </main>
        </div>
      </ProveedorAuth>
    </BrowserRouter>
  )
}