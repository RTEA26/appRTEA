/**
 * R-TEA - Aplicación de Seguimiento Educativo y Gestión de Aula Reducida
 * Arquitectura 100% Local-First con privacidad total, gamificación, matriz adaptativa,
 * radar chart con Chart.js, asistente IA pedagógico contextual y repositorio dual.
 */

// ================= ESTADO GLOBAL Y PERSISTENCIA (LOCALSTORAGE) =================
const STORAGE_KEY = 'RTEA_APP_DATA_V1';

const DEFAULT_STATE = {
  currentTab: 'alumnos', // 'alumnos' | 'calendario' | 'recursos'
  selectedStudentId: null,
  activeResourceTab: 'trabajo', // 'trabajo' | 'biblioteca'
  filterResourceArea: 'Todas',
  calendarCurrentDate: new Date().toISOString().split('T')[0],
  
  students: [
    {
      id: 'student-1',
      alias: 'Explorador Azul',
      color: '#0284C7', // Azul
      bgLight: '#E0F2FE',
      notes: 'Gran sensibilidad táctil y auditiva. Fuerte afinidad por el orden visual y rutinas estructuradas.',
      createdAt: '2026-09-01',
      documents: [
        {
          id: 'doc-101',
          name: 'Dictamen de Escolarización 2026.pdf',
          size: '1.2 MB',
          date: '2026-09-10',
          fileData: null
        },
        {
          id: 'doc-102',
          name: 'Adaptación Curricular Individualizada (ACI).pdf',
          size: '850 KB',
          date: '2026-10-02',
          fileData: null
        }
      ],
      evaluationItems: [
        { id: 'item-1', title: 'Atención compartida en mesa', category: 'Cognición', score: 4 }, // Plata 🥈
        { id: 'item-2', title: 'Uso de pictogramas para peticiones', category: 'Comunicación', score: 5 }, // Oro 🥇
        { id: 'item-3', title: 'Regulación emocional en cambios de tarea', category: 'Sensorial', score: 3 }, // Bronce 🥉
        { id: 'item-4', title: 'Interacción con iguales en recreo', category: 'Social', score: 2 }, // En proceso
        { id: 'item-5', title: 'Seguimiento de agenda TEACCH', category: 'Autonomía', score: 5 }, // Oro 🥇
        { id: 'item-6', title: 'Tolerancia a estímulos sonoros inesperados', category: 'Sensorial', score: 2 } // En proceso
      ],
      chatMessages: [
        {
          sender: 'ai',
          text: '¡Hola! Soy tu asistente de aula R-TEA. Tengo cargadas las notas, los 2 documentos de informe y las 6 evaluaciones de "Explorador Azul". ¿En qué dinámica o adaptación te puedo apoyar hoy?'
        }
      ]
    },
    {
      id: 'student-2',
      alias: 'Cometa Amarillo',
      color: '#D97706', // Ámbar
      bgLight: '#FEF3C7',
      notes: 'Comunicación verbal fluida pero dificultades en pragmática y comprensión no literal.',
      createdAt: '2026-09-05',
      documents: [
        {
          id: 'doc-201',
          name: 'Informe Fonoaudiológico / Logopedia.pdf',
          size: '940 KB',
          date: '2026-09-15',
          fileData: null
        }
      ],
      evaluationItems: [
        { id: 'item-201', title: 'Comprensión de ironías y dobles sentidos', category: 'Comunicación', score: 2 },
        { id: 'item-202', title: 'Respeto de turnos en conversación', category: 'Social', score: 3 }, // Bronce 🥉
        { id: 'item-203', title: 'Autonomía en organización de materiales', category: 'Autonomía', score: 4 }, // Plata 🥈
        { id: 'item-204', title: 'Resolución de pequeños conflictos', category: 'Social', score: 3 } // Bronce 🥉
      ],
      chatMessages: [
        {
          sender: 'ai',
          text: 'Buenas. Asistente R-TEA listo para asesorarte con las intervenciones de "Cometa Amarillo".'
        }
      ]
    }
  ],

  // Registro diario de sesiones
  sessions: [
    {
      id: 'sess-1',
      studentId: 'student-1',
      date: '2026-11-10',
      content: 'Sesión muy positiva. Trabajamos asociación con agenda visual de 4 pasos. Aceptó la retirada anticipada de materiales sin conductas disruptivas.'
    },
    {
      id: 'sess-2',
      studentId: 'student-1',
      date: '2026-11-11',
      content: 'Introducción de nueva actividad de clasificación por colores. Presentó ligera sobrecarga con ruidos exteriores del pasillo; se aplicaron protectores auditivos con éxito.'
    },
    {
      id: 'sess-3',
      studentId: 'student-2',
      date: '2026-11-11',
      content: 'Role-playing de situaciones en el patio: cómo pedir turno en el juego de pelota. Logró identificar las señales del compañero.'
    }
  ],

  // Repositorio: Recursos de trabajo por áreas
  workResources: [
    {
      id: 'res-1',
      title: 'Agenda Visual TEACCH para Estructuración del Aula',
      area: 'Estructuración y Rutinas',
      description: 'Secuencia imprimible en tarjetas con pictogramas ARASAAC para anticipación de la jornada escolar.',
      fileName: 'Agenda_Visual_TEACCH_2026.pdf',
      fileSize: '3.4 MB',
      createdAt: '2026-09-12'
    },
    {
      id: 'res-2',
      title: 'Termómetro de Regulación Emocional',
      area: 'Regulación Sensorial',
      description: 'Escala visual de 5 niveles para que el alumno señale su nivel de sobrecarga o calma.',
      fileName: 'Termometro_Emocional_A4.pdf',
      fileSize: '1.8 MB',
      createdAt: '2026-09-18'
    },
    {
      id: 'res-3',
      title: 'Tiras de Petición Espontánea PECS',
      area: 'Comunicación y Lenguaje',
      description: 'Láminas recortables con velcro para la estructura "Yo quiero [objeto]".',
      fileName: 'Tiras_Peticion_PECS.pdf',
      fileSize: '2.1 MB',
      createdAt: '2026-10-05'
    }
  ],

  // Repositorio: Biblioteca (Cuentos y Libros con fotos y títulos)
  libraryBooks: [
    {
      id: 'book-1',
      title: 'El cazo de Lorenzo',
      author: 'Isabelle Carrier',
      notes: 'Excelente para trabajar la aceptación de la diferencia y las ayudas técnicas/emocionales.',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      createdAt: '2026-09-15'
    },
    {
      id: 'book-2',
      title: 'Por cuatro esquinitas de nada',
      author: 'Jérôme Ruillier',
      notes: 'Metáfora sobre la adaptación del entorno en lugar de forzar a encajar al niño.',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80',
      createdAt: '2026-09-22'
    },
    {
      id: 'book-3',
      title: 'Monstruo Rosa',
      author: 'Olga de Dios',
      notes: 'Un cuento sobre el valor de la diversidad y encontrar el lugar propio.',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80',
      createdAt: '2026-10-10'
    }
  ]
};

// Carga inicial o persistida
let appState = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
})();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
}

// ================= PALETAS Y CONSTANTES =================
const AVATAR_COLORS = [
  { hex: '#0284C7', bg: '#E0F2FE', label: 'Azul Océano' },
  { hex: '#FF5C38', bg: '#FFF0ED', label: 'Naranja Cálido' },
  { hex: '#7C3AED', bg: '#F3E8FF', label: 'Violeta Creativo' },
  { hex: '#10B981', bg: '#D1FAE5', label: 'Verde Esperanza' },
  { hex: '#D97706', bg: '#FEF3C7', label: 'Ámbar Cálido' }
];

const RESOURCE_AREAS = [
  'Todas',
  'Comunicación y Lenguaje',
  'Regulación Sensorial',
  'Estructuración y Rutinas',
  'Habilidades Sociales',
  'Motricidad y Grafismo',
  'Autonomía Personal'
];

let radarChartInstance = null;
let currentEditingStudentId = null;
let currentUploadingDocStudentId = null;
let currentEditingItemId = null;
let activeSubTabInStudent = 'evaluacion'; // 'evaluacion' | 'informes' | 'radar' | 'chat'

// ================= NAVEGACIÓN Y TABS PRINCIPALES =================
  function switchTab(tabName) {
    appState.currentTab = tabName;
    saveState();

    // Actualizar botones de navegación
    ['alumnos', 'calendario', 'recursos'].forEach(tab => {
      const btn = document.getElementById(`tab-btn-${tab}`);
      if (!btn) return;
      if (tab === tabName) {
        btn.className = 'scale-tap flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-200 bg-brand-orange text-white shadow-md';
      } else {
        btn.className = 'scale-tap flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-200 text-slate-600 hover:text-slate-900';
      }
    });

    renderCurrentTab();
  }

function renderCurrentTab() {
  const container = document.getElementById('mainContainer');
  if (!container) return;

  if (appState.currentTab === 'alumnos') {
    renderAlumnosTab(container);
  } else if (appState.currentTab === 'calendario') {
    renderCalendarioTab(container);
  } else if (appState.currentTab === 'recursos') {
    renderRecursosTab(container);
  }

  // Refrescar iconos Lucide tras inyección de DOM
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ================= MÓDULO 1: ALUMNOS (PERFILES ANÓNIMOS, EVALUACIÓN, RADAR, CHAT) =================
function renderAlumnosTab(container) {
  // Asegurarse de que haya un alumno seleccionado si existen
  if (!appState.selectedStudentId && appState.students.length > 0) {
    appState.selectedStudentId = appState.students[0].id;
  }

  const selectedStudent = appState.students.find(s => s.id === appState.selectedStudentId) || appState.students[0];

  let html = `
    <div class="space-y-6">
      <!-- Barra Superior de Alumnos: Selector de los 5 Alumnos Máx + Botón de Añadir -->
      <div class="glass-card rounded-3xl p-3 sm:p-4 shadow-sm border border-slate-200/80">
        <div class="flex items-center justify-between mb-3 px-1">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
            <h2 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Alumnos en Aula Reducida (${appState.students.length}/5 máx.)
            </h2>
          </div>
          ${appState.students.length < 5 ? `
            <button onclick="openCreateStudentModal()" class="scale-tap flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-brand-orange border border-orange-200 text-xs font-bold hover:bg-orange-100 transition">
              <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
              <span>Añadir Alumno</span>
            </button>
          ` : `
            <span class="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Capacidad máxima alcanzada (5/5)
            </span>
          `}
        </div>

        <!-- Fila de Chips / Perfiles -->
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          ${appState.students.map(st => {
            const isSelected = selectedStudent && st.id === selectedStudent.id;
            return `
              <div onclick="selectStudent('${st.id}')" class="scale-tap cursor-pointer flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all duration-200 border ${
                isSelected 
                  ? 'bg-white shadow-md border-slate-400 ring-2 ring-brand-orange/40' 
                  : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200/80 text-slate-600'
              }">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-sm" style="background-color: ${st.color}">
                  👦
                </div>
                <div class="text-left pr-1">
                  <div class="text-xs font-bold text-slate-900 leading-tight">${escapeHtml(st.alias)}</div>
                  <div class="text-[10px] text-slate-500 font-medium">${st.evaluationItems ? st.evaluationItems.length : 0} ítems</div>
                </div>
              </div>
            `;
          }).join('')}

          ${appState.students.length === 0 ? `
            <div class="py-4 text-center w-full text-slate-400 text-xs font-medium">
              No hay alumnos registrados. Haz clic en "Añadir Alumno" para crear el primero.
            </div>
          ` : ''}
        </div>
      </div>
  `;

  if (selectedStudent) {
    html += `
      <!-- Ficha y Detalle del Alumno Seleccionado -->
      <div class="glass-card rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
        <!-- Encabezado del Perfil: Alias, Botón Editar, Botón Eliminar Alumno -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div class="flex items-center gap-3.5">
            <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md" style="background-color: ${selectedStudent.color}">
              🧒
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  ${escapeHtml(selectedStudent.alias)}
                </h3>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  Perfil Anónimo
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">${escapeHtml(selectedStudent.notes || 'Sin observaciones iniciales.')}</p>
            </div>
          </div>

          <!-- Acciones de Gestión de Alumno: Editar y ELIMINAR ALUMNO -->
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button onclick="openEditStudentModal('${selectedStudent.id}')" class="scale-tap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              <span>Editar Alias</span>
            </button>
            <button onclick="confirmDeleteStudent('${selectedStudent.id}')" class="scale-tap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition" title="Eliminar Alumno">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              <span>Eliminar Alumno</span>
            </button>
          </div>
        </div>

        <!-- Subpestañas del Alumno: Evaluación (Renombrada), Carpeta de Informes, Informe Final IA (Radar), Asistente IA -->
        <div class="flex items-center gap-2 border-b border-slate-200/80 pt-4 overflow-x-auto custom-scrollbar">
          <button onclick="switchStudentSubTab('evaluacion')" class="scale-tap pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeSubTabInStudent === 'evaluacion'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }">
            <span class="text-sm">⭐</span>
            <span>Evaluación</span>
          </button>

          <button onclick="switchStudentSubTab('informes')" class="scale-tap pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeSubTabInStudent === 'informes'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }">
            <span class="text-sm">📁</span>
            <span>Carpeta de Informes (${(selectedStudent.documents || []).length}/3)</span>
          </button>

          <button onclick="switchStudentSubTab('radar')" class="scale-tap pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeSubTabInStudent === 'radar'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }">
            <span class="text-sm">🎯</span>
            <span>Informe Final IA (Radar)</span>
          </button>

          <button onclick="switchStudentSubTab('chat')" class="scale-tap pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeSubTabInStudent === 'chat'
              ? 'border-brand-purple text-brand-purple'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }">
            <span class="text-sm">🤖</span>
            <span>Asistente Virtual IA</span>
          </button>
        </div>

        <!-- Contenido de la Subpestaña Activa -->
        <div class="pt-5">
          ${renderStudentSubTabContent(selectedStudent)}
        </div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;

  // Si la subpestaña activa es Radar, renderizamos el Chart.js
  if (selectedStudent && activeSubTabInStudent === 'radar') {
    renderRadarChart(selectedStudent);
  }
}

function selectStudent(studentId) {
  appState.selectedStudentId = studentId;
  saveState();
  renderCurrentTab();
}

function switchStudentSubTab(subTab) {
  activeSubTabInStudent = subTab;
  renderCurrentTab();
}

// ---------------- SUBPESTAÑA: MATRIZ DE EVALUACIÓN ----------------
function renderStudentSubTabContent(student) {
  if (activeSubTabInStudent === 'evaluacion') {
    return renderEvaluationMatrix(student);
  } else if (activeSubTabInStudent === 'informes') {
    return renderStudentDocuments(student);
  } else if (activeSubTabInStudent === 'radar') {
    return renderStudentRadarView(student);
  } else if (activeSubTabInStudent === 'chat') {
    return renderStudentChatView(student);
  }
}

function renderEvaluationMatrix(student) {
  const items = student.evaluationItems || [];

  return `
    <div class="space-y-4">
      <!-- Cabecera de la Matriz y Botón Añadir Ítem -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <div>
          <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span class="text-sm">⭐</span>
            <span>Escala de Evaluación Gamificada (0 a 5)</span>
          </h4>
          <p class="text-[11px] text-slate-500 mt-0.5">
            0-2: En proceso | 3: 🥉 Bronce (Parcial) | 4: 🥈 Plata (Notable) | 5: 🥇 Oro (Consolidado)
          </p>
        </div>
        <button onclick="openCreateItemModal()" class="scale-tap flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 font-bold text-xs border border-slate-300 shadow-sm hover:bg-slate-50 transition self-start sm:self-auto">
          <i data-lucide="plus" class="w-3.5 h-3.5 text-brand-orange"></i>
          <span>Añadir Ítem de Evaluación</span>
        </button>
      </div>

      <!-- Listado de Ítems de Evaluación -->
      <div class="space-y-3">
        ${items.map(item => {
          const score = item.score !== undefined ? item.score : 0;
          let medalBadge = '';
          if (score === 5) {
            medalBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">🥇 Medalla de Oro</span>';
          } else if (score === 4) {
            medalBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-200 text-slate-800 border border-slate-400">🥈 Medalla de Plata</span>';
          } else if (score === 3) {
            medalBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-200">🥉 Medalla de Bronce</span>';
          } else {
            medalBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">En proceso</span>';
          }

          return `
            <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    ${escapeHtml(item.category || 'General')}
                  </span>
                  ${medalBadge}
                </div>
                <h5 class="text-sm font-bold text-slate-900">${escapeHtml(item.title)}</h5>
              </div>

              <!-- Selector de Puntuación (0 a 5) y Acciones CRUD -->
              <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <!-- Botones 0 a 5 -->
                <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  ${[0, 1, 2, 3, 4, 5].map(val => {
                    const isSelected = score === val;
                    let btnColor = 'hover:bg-white text-slate-600';
                    if (isSelected) {
                      if (val === 5) btnColor = 'bg-amber-400 text-slate-900 font-black shadow-sm';
                      else if (val === 4) btnColor = 'bg-slate-300 text-slate-900 font-black shadow-sm';
                      else if (val === 3) btnColor = 'bg-amber-600 text-white font-black shadow-sm';
                      else btnColor = 'bg-slate-800 text-white font-bold shadow-sm';
                    }
                    return `
                      <button onclick="updateItemScore('${student.id}', '${item.id}', ${val})" class="scale-tap w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${btnColor}">
                        ${val}
                      </button>
                    `;
                  }).join('')}
                </div>

                <!-- Botones Editar y Borrar Ítem -->
                <div class="flex items-center gap-1">
                  <button onclick="openEditItemModal('${item.id}')" class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition" title="Editar Ítem">
                    <i data-lucide="edit-2" class="w-4 h-4"></i>
                  </button>
                  <button onclick="confirmDeleteItem('${student.id}', '${item.id}')" class="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Eliminar Ítem">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}

        ${items.length === 0 ? `
          <div class="py-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs">
            No hay ítems en la matriz de evaluación. Pulsa en "Añadir Ítem de Trabajo" para comenzar.
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ---------------- SUBPESTAÑA: CARPETA DE INFORMES (MÁX 3 + BORRADO) ----------------
function renderStudentDocuments(student) {
  const docs = student.documents || [];
  const maxDocs = 3;

  return `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-sky-50/60 p-4 rounded-2xl border border-sky-100">
        <div>
          <h4 class="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-2">
            <i data-lucide="shield" class="w-4 h-4 text-sky-600"></i>
            <span>Documentación y Expedientes Médicos/Pedagógicos (${docs.length}/${maxDocs})</span>
          </h4>
          <p class="text-[11px] text-sky-700 mt-0.5">
            Espacio confidencial para subir hasta 3 PDFs o informes psicopedagógicos directamente desde el dispositivo.
          </p>
        </div>
        ${docs.length < maxDocs ? `
          <button onclick="openUploadDocModal('${student.id}')" class="scale-tap flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue text-white font-bold text-xs shadow-sm hover:bg-sky-700 transition self-start sm:self-auto">
            <i data-lucide="upload" class="w-3.5 h-3.5"></i>
            <span>Subir Documento</span>
          </button>
        ` : `
          <span class="text-[11px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Límite de 3 documentos alcanzado
          </span>
        `}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        ${docs.map(doc => `
          <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div class="flex items-start justify-between gap-2">
              <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                <i data-lucide="file-text" class="w-5 h-5"></i>
              </div>
              <!-- BOTÓN BORRAR DOCUMENTO (Requisito explícito del usuario) -->
              <button onclick="confirmDeleteStudentDoc('${student.id}', '${doc.id}')" class="scale-tap p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Eliminar Documento">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
            <div class="my-3">
              <h5 class="text-xs font-bold text-slate-900 line-clamp-2" title="${escapeHtml(doc.name)}">${escapeHtml(doc.name)}</h5>
              <p class="text-[10px] text-slate-400 mt-1">${doc.size || 'PDF'} • ${doc.date}</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button onclick="viewMockDoc('${escapeHtml(doc.name)}')" class="scale-tap flex-1 py-1.5 text-center text-[11px] font-bold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
                Abrir / Ver
              </button>
              <button onclick="downloadMockDoc('${escapeHtml(doc.name)}')" class="scale-tap p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition" title="Descargar">
                <i data-lucide="download" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `).join('')}

        ${docs.length === 0 ? `
          <div class="col-span-3 py-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs">
            No se han subido documentos para este alumno.
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ---------------- SUBPESTAÑA: INFORME FINAL IA & GRÁFICA DE RADAR ----------------
function renderStudentRadarView(student) {
  const items = student.evaluationItems || [];
  const totalScore = items.reduce((acc, it) => acc + (it.score || 0), 0);
  const maxPossible = (items.length * 5) || 1;
  const overallPercentage = Math.round((totalScore / maxPossible) * 100);

  // Clasificación cualitativa por IA
  const goldItems = items.filter(it => it.score === 5);
  const silverItems = items.filter(it => it.score === 4);
  const bronzeItems = items.filter(it => it.score === 3);
  const pendingItems = items.filter(it => it.score < 3);

  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Gráfica de Radar (Chart.js) -->
        <div class="lg:col-span-6 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
          <div class="flex items-center justify-between w-full mb-3">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="target" class="w-4 h-4 text-brand-orange"></i>
              <span>Gráfica de Radar: Consecución por Ítem</span>
            </h4>
            <span class="text-xs font-black px-2.5 py-1 rounded-full bg-orange-100 text-brand-orange border border-orange-200">
              ${overallPercentage}% Global
            </span>
          </div>

          <div class="w-full max-w-[340px] sm:max-w-[400px] aspect-square flex items-center justify-center relative">
            <canvas id="radarChartCanvas"></canvas>
          </div>
          <p class="text-[11px] text-slate-400 mt-2 text-center">
            Escala normalizada: 0% (Nivel 0) a 100% (Consolidación total - Nivel 5)
          </p>
        </div>

        <!-- Síntesis Cualitativa Generada por IA -->
        <div class="lg:col-span-6 space-y-4">
          <div class="bg-gradient-to-br from-purple-50 to-sky-50 p-5 rounded-3xl border border-purple-100 shadow-sm">
            <div class="flex items-center gap-2 text-brand-purple font-extrabold text-sm mb-2">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
              <span>Informe Cualitativo de Fin de Curso (IA Pedagógica)</span>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed">
              El alumno <strong>${escapeHtml(student.alias)}</strong> ha demostrado una evolución global del <strong>${overallPercentage}%</strong> en los objetivos adaptados a su ritmo y perfil sensorial en aula reducida.
            </p>
          </div>

          <!-- Logros Conseguidos (Medallas Oro y Plata) -->
          <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
            <div class="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
              <i data-lucide="award" class="w-4 h-4 text-emerald-600"></i>
              <span>Logros Consolidados y Destacados (${goldItems.length + silverItems.length})</span>
            </div>
            <ul class="text-xs text-slate-600 space-y-1.5 pl-2">
              ${goldItems.map(g => `<li class="flex items-center gap-1.5">🥇 <span class="font-semibold">${escapeHtml(g.title)}</span> (100% consolidado)</li>`).join('')}
              ${silverItems.map(s => `<li class="flex items-center gap-1.5">🥈 <span class="font-semibold">${escapeHtml(s.title)}</span> (Avance notable)</li>`).join('')}
              ${(goldItems.length === 0 && silverItems.length === 0) ? '<li class="text-slate-400 italic">No hay ítems consolidados aún.</li>' : ''}
            </ul>
          </div>

          <!-- Aspectos Pendientes / A Trabajar -->
          <div class="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
            <div class="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
              <i data-lucide="trending-up" class="w-4 h-4 text-amber-600"></i>
              <span>Aspectos en Proceso y Continuidad (${pendingItems.length + bronzeItems.length})</span>
            </div>
            <ul class="text-xs text-slate-600 space-y-1.5 pl-2">
              ${bronzeItems.map(b => `<li class="flex items-center gap-1.5">🥉 <span class="font-semibold">${escapeHtml(b.title)}</span> (Conseguido parcialmente)</li>`).join('')}
              ${pendingItems.map(p => `<li class="flex items-center gap-1.5">🔄 <span class="font-semibold">${escapeHtml(p.title)}</span> (En proceso - requiere apoyo estructurado)</li>`).join('')}
            </ul>
          </div>

          <div class="flex justify-end pt-2">
            <button onclick="downloadStudentFinalReport('${student.id}')" class="scale-tap flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow hover:bg-slate-800 transition">
              <i data-lucide="file-down" class="w-4 h-4"></i>
              <span>Exportar Informe Completo en PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRadarChart(student) {
  const canvas = document.getElementById('radarChartCanvas');
  if (!canvas) return;

  const items = student.evaluationItems || [];
  if (items.length === 0) return;

  const labels = items.map(it => it.title.length > 20 ? it.title.substring(0, 18) + '...' : it.title);
  // Transformar puntuación 0-5 a porcentaje 0-100%
  const dataValues = items.map(it => Math.round(((it.score || 0) / 5) * 100));

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  radarChartInstance = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: '% de Consecución',
        data: dataValues,
        backgroundColor: 'rgba(255, 92, 56, 0.22)',
        borderColor: '#FF5C38',
        borderWidth: 2.5,
        pointBackgroundColor: '#FF5C38',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#FF5C38',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(148, 163, 184, 0.25)' },
          grid: { color: 'rgba(148, 163, 184, 0.2)' },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20,
            display: false
          },
          pointLabels: {
            font: {
              family: 'Plus Jakarta Sans',
              size: 10,
              weight: '600'
            },
            color: '#334155'
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// ---------------- SUBPESTAÑA: ASISTENTE VIRTUAL IA (CHAT INTEGRADO) ----------------
function renderStudentChatView(student) {
  const messages = student.chatMessages || [];

  return `
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
      <!-- Encabezado del Asistente -->
      <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-purple-50/50 rounded-t-3xl">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-sm">
            <i data-lucide="bot" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Asistente Pedagógico Contextual</span>
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h4>
            <p class="text-[10px] text-slate-500">Conectado a expedientes, diario de sesiones y matriz de ${escapeHtml(student.alias)}</p>
          </div>
        </div>
        <button onclick="clearStudentChat('${student.id}')" class="text-[11px] font-semibold text-slate-400 hover:text-slate-600">
          Reiniciar
        </button>
      </div>

      <!-- Contenedor de Mensajes -->
      <div id="chatMessagesBox" class="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
        ${messages.map(msg => {
          const isAi = msg.sender === 'ai';
          return `
            <div class="flex ${isAi ? 'justify-start' : 'justify-end'}">
              <div class="max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                isAi 
                  ? 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/60' 
                  : 'bg-brand-purple text-white rounded-tr-sm shadow-sm'
              }">
                ${escapeHtml(msg.text).replace(/\n/g, '<br>')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Preguntas sugeridas para acelerar la sesión -->
      <div class="px-4 py-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto custom-scrollbar bg-slate-50/50">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Sugerencias:</span>
        <button onclick="quickAskAI('${student.id}', '¿Qué propuesta de intervención recomiendas para los objetivos que están en proceso?')" class="scale-tap flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
          Recomendaciones para objetivos en proceso
        </button>
        <button onclick="quickAskAI('${student.id}', 'Resume los últimos registros del diario de aula de este alumno')" class="scale-tap flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
          Resumen de sesiones recientes
        </button>
        <button onclick="quickAskAI('${student.id}', 'Proponme una adaptación sensorial ante sobrecarga auditiva')" class="scale-tap flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
          Adaptación sensorial
        </button>
      </div>

      <!-- Barra de Envío -->
      <div class="p-3 border-t border-slate-100 flex items-center gap-2 bg-white rounded-b-3xl">
        <input type="text" id="chatInputMessage" placeholder="Pregunta sobre adaptaciones, actividades TEACCH o informes..." 
          onkeydown="if(event.key==='Enter') sendAIChatMessage('${student.id}')"
          class="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white text-slate-800">
        <button onclick="sendAIChatMessage('${student.id}')" class="scale-tap p-2.5 rounded-2xl bg-brand-purple text-white shadow hover:bg-purple-700 transition">
          <i data-lucide="send" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;
}

function sendAIChatMessage(studentId) {
  const input = document.getElementById('chatInputMessage');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;

  if (!student.chatMessages) student.chatMessages = [];
  student.chatMessages.push({ sender: 'user', text });
  input.value = '';

  saveState();
  renderCurrentTab();

  // Simulación inteligente contextual de la IA Pedagógica
  setTimeout(() => {
    const aiResponse = generateAIPedagogicalResponse(student, text);
    student.chatMessages.push({ sender: 'ai', text: aiResponse });
    saveState();
    renderCurrentTab();

    // Scroll automático al final del chat
    const box = document.getElementById('chatMessagesBox');
    if (box) box.scrollTop = box.scrollHeight;
  }, 600);
}

function quickAskAI(studentId, questionText) {
  const input = document.getElementById('chatInputMessage');
  if (input) input.value = questionText;
  sendAIChatMessage(studentId);
}

function generateAIPedagogicalResponse(student, query) {
  const q = query.toLowerCase();
  const items = student.evaluationItems || [];
  const pending = items.filter(it => it.score < 3);
  const gold = items.filter(it => it.score === 5);
  const studentSessions = appState.sessions.filter(s => s.studentId === student.id);

  if (q.includes('resumen') || q.includes('diario') || q.includes('sesion')) {
    if (studentSessions.length === 0) {
      return `Actualmente no hay sesiones anotadas en el diario para ${student.alias}. Puedes agregar notas desde la pestaña "Diario Aula".`;
    }
    const lastSession = studentSessions[studentSessions.length - 1];
    return `Último registro en el diario (${lastSession.date}): "${lastSession.content}". En total hay ${studentSessions.length} intervenciones registradas. Se aprecia una respuesta favorable con apoyos visuales.`;
  }

  if (q.includes('en proceso') || q.includes('recomend') || q.includes('propuesta')) {
    if (pending.length === 0) {
      return `¡Enhorabuena! ${student.alias} tiene todos los objetivos en nivel 3 o superior (bronce, plata y oro). Se recomienda plantear nuevos desafíos en habilidades sociales avanzadas.`;
    }
    const pendingNames = pending.map(p => `• "${p.title}" (Nivel ${p.score})`).join('\n');
    return `Para los ítems que se encuentran en proceso:\n${pendingNames}\n\nTe recomiendo:\n1. Descomponer cada tarea en pasos encadenados hacia atrás (backward chaining).\n2. Reforzar con el sistema de apoyos visuales que ya tiene consolidado en "${gold[0] ? gold[0].title : 'rutinas'}".\n3. Reducir la carga de estimulación sensorial durante las transiciones.`;
  }

  if (q.includes('sensorial') || q.includes('auditiva') || q.includes('ruido') || q.includes('sobrecarga')) {
    return `Estrategia de regulación para ${student.alias}:\n1. Ofrecer cascos con cancelación o protectores auditivos antes de las transiciones al pasillo.\n2. Habilitar un "rincón de la calma" con cojines ponderados y luz tenue.\n3. Anticipar mediante el pictograma de "parar y respirar" antes de que se produzca una desregulación motriz.`;
  }

  return `Entendido. Analizando el perfil de ${student.alias} (con ${items.length} objetivos en matriz y ${student.documents.length} documentos adjuntos): La mejor aproximación pedagógica es mantener una estructura predecible con apoyos visuales directos y celebrar cada avance hacia la consolidación de sus medallas.`;
}

function clearStudentChat(studentId) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;
  student.chatMessages = [
    { sender: 'ai', text: `Chat reiniciado. ¿En qué objetivo o intervención de ${student.alias} nos enfocamos?` }
  ];
  saveState();
  renderCurrentTab();
}

// ================= ACCIONES CRUD DE ALUMNOS =================
function openCreateStudentModal() {
  if (appState.students.length >= 5) {
    alert('El aula reducida permite un máximo estricto de 5 alumnos.');
    return;
  }
  currentEditingStudentId = null;
  document.getElementById('modalStudentTitle').innerHTML = `
    <i data-lucide="user-plus" class="w-5 h-5 text-brand-orange"></i>
    <span>Nuevo Alumno (Perfil Anónimo)</span>
  `;
  document.getElementById('studentAliasInput').value = '';
  document.getElementById('studentNotesInput').value = '';
  renderColorPickers('#0284C7');
  document.getElementById('modalStudent').classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function openEditStudentModal(studentId) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;
  currentEditingStudentId = studentId;
  document.getElementById('modalStudentTitle').innerHTML = `
    <i data-lucide="edit-3" class="w-5 h-5 text-brand-orange"></i>
    <span>Editar Alias y Perfil</span>
  `;
  document.getElementById('studentAliasInput').value = student.alias;
  document.getElementById('studentNotesInput').value = student.notes || '';
  renderColorPickers(student.color);
  document.getElementById('modalStudent').classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function renderColorPickers(selectedColor) {
  const container = document.getElementById('colorPickerContainer');
  if (!container) return;
  container.innerHTML = AVATAR_COLORS.map(c => `
    <button type="button" onclick="selectColorInPicker('${c.hex}')" class="h-9 rounded-xl flex items-center justify-center transition border-2 ${
      selectedColor === c.hex ? 'border-slate-800 scale-105 shadow' : 'border-transparent'
    }" style="background-color: ${c.hex}">
      ${selectedColor === c.hex ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : ''}
    </button>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
}

let activeChosenColor = '#0284C7';
function selectColorInPicker(hex) {
  activeChosenColor = hex;
  renderColorPickers(hex);
}

function closeStudentModal() {
  document.getElementById('modalStudent').classList.add('hidden');
}

function saveStudent() {
  const alias = document.getElementById('studentAliasInput').value.trim();
  const notes = document.getElementById('studentNotesInput').value.trim();

  if (!alias) {
    alert('Por favor introduce un alias o apodo manual para el alumno.');
    return;
  }

  if (currentEditingStudentId) {
    // Editar
    const student = appState.students.find(s => s.id === currentEditingStudentId);
    if (student) {
      student.alias = alias;
      student.notes = notes;
      student.color = activeChosenColor;
    }
  } else {
    // Crear nuevo (máx 5)
    if (appState.students.length >= 5) {
      alert('Capacidad máxima de 5 alumnos alcanzada.');
      return;
    }
    const newStudent = {
      id: 'student-' + Date.now(),
      alias: alias,
      color: activeChosenColor,
      notes: notes,
      createdAt: new Date().toISOString().split('T')[0],
      documents: [],
      evaluationItems: [
        { id: 'item-' + Date.now() + '-1', title: 'Atención compartida y seguimiento de rutinas', category: 'Cognición', score: 2 },
        { id: 'item-' + Date.now() + '-2', title: 'Regulación emocional y sensorial en aula', category: 'Sensorial', score: 3 },
        { id: 'item-' + Date.now() + '-3', title: 'Peticiones espontáneas mediante SAAC', category: 'Comunicación', score: 1 }
      ],
      chatMessages: [
        { sender: 'ai', text: `¡Hola! Perfil de ${alias} creado en confidencialidad. ¿Qué objetivo deseas evaluar primero?` }
      ]
    };
    appState.students.push(newStudent);
    appState.selectedStudentId = newStudent.id;
  }

  saveState();
  closeStudentModal();
  renderCurrentTab();
}

// Requisito explícito: Eliminar Alumno
function confirmDeleteStudent(studentId) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;

  const confirmMsg = `¿Estás seguro de que deseas eliminar permanentemente el perfil anónimo de "${student.alias}"?\nEsta acción borrará sus evaluaciones, documentos e historial de diario.`;
  if (confirm(confirmMsg)) {
    appState.students = appState.students.filter(s => s.id !== studentId);
    // Borrar sesiones asociadas
    appState.sessions = appState.sessions.filter(s => s.studentId !== studentId);

    if (appState.selectedStudentId === studentId) {
      appState.selectedStudentId = appState.students.length > 0 ? appState.students[0].id : null;
    }

    saveState();
    renderCurrentTab();
  }
}

// ================= GESTIÓN DE DOCUMENTOS (MÁX 3 + BORRADO) =================
function openUploadDocModal(studentId) {
  currentUploadingDocStudentId = studentId;
  document.getElementById('docNameInput').value = '';
  document.getElementById('docFileInput').value = '';
  document.getElementById('modalUploadDoc').classList.remove('hidden');
}

function closeUploadDocModal() {
  document.getElementById('modalUploadDoc').classList.add('hidden');
}

function confirmUploadDoc() {
  const nameInput = document.getElementById('docNameInput').value.trim();
  const fileInput = document.getElementById('docFileInput');

  if (!nameInput && (!fileInput.files || fileInput.files.length === 0)) {
    alert('Introduce un nombre descriptivo o selecciona un archivo.');
    return;
  }

  const student = appState.students.find(s => s.id === currentUploadingDocStudentId);
  if (!student) return;

  if (!student.documents) student.documents = [];
  if (student.documents.length >= 3) {
    alert('Cada alumno tiene un cupo máximo de 3 documentos para proteger la privacidad y el almacenamiento del dispositivo.');
    return;
  }

  const file = fileInput.files[0];
  const finalName = nameInput || (file ? file.name : 'Documento_Evaluacion.pdf');
  const sizeStr = file ? Math.round(file.size / 1024) + ' KB' : '1.1 MB';

  student.documents.push({
    id: 'doc-' + Date.now(),
    name: finalName,
    size: sizeStr,
    date: new Date().toISOString().split('T')[0]
  });

  saveState();
  closeUploadDocModal();
  renderCurrentTab();
}

// Requisito explícito: Borrar Documento
function confirmDeleteStudentDoc(studentId, docId) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;

  const doc = student.documents.find(d => d.id === docId);
  if (!doc) return;

  if (confirm(`¿Deseas eliminar el documento "${doc.name}" de la carpeta de este alumno?`)) {
    student.documents = student.documents.filter(d => d.id !== docId);
    saveState();
    renderCurrentTab();
  }
}

function viewMockDoc(docName) {
  alert(`Visualizador Seguro R-TEA:\nAbriendo documento confidencial: "${docName}"\n\nEl archivo se mantiene cifrado en almacenamiento local del dispositivo.`);
}

function downloadMockDoc(docName) {
  alert(`Descarga completada en el dispositivo:\nArchivo: "${docName}"`);
}

// ================= GESTIÓN DE ÍTEMS DE EVALUACIÓN (CRUD) =================
function openCreateItemModal() {
  currentEditingItemId = null;
  document.getElementById('modalItemTitle').innerHTML = `
    <i data-lucide="sparkles" class="w-5 h-5 text-amber-500"></i>
    <span>Nuevo Ítem de Evaluación Adaptativo</span>
  `;
  document.getElementById('itemTitleInput').value = '';
  document.getElementById('itemCategoryInput').value = 'Comunicación';
  document.getElementById('modalEvaluationItem').classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function openEditItemModal(itemId) {
  const student = appState.students.find(s => s.id === appState.selectedStudentId);
  if (!student) return;
  const item = (student.evaluationItems || []).find(it => it.id === itemId);
  if (!item) return;

  currentEditingItemId = itemId;
  document.getElementById('modalItemTitle').innerHTML = `
    <i data-lucide="edit-3" class="w-5 h-5 text-amber-500"></i>
    <span>Editar Ítem de Evaluación</span>
  `;
  document.getElementById('itemTitleInput').value = item.title;
  document.getElementById('itemCategoryInput').value = item.category || 'Comunicación';
  document.getElementById('modalEvaluationItem').classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeItemModal() {
  document.getElementById('modalEvaluationItem').classList.add('hidden');
}

function saveEvaluationItem() {
  const title = document.getElementById('itemTitleInput').value.trim();
  const category = document.getElementById('itemCategoryInput').value;

  if (!title) {
    alert('Introduce el nombre u objetivo del ítem.');
    return;
  }

  const student = appState.students.find(s => s.id === appState.selectedStudentId);
  if (!student) return;

  if (!student.evaluationItems) student.evaluationItems = [];

  if (currentEditingItemId) {
    const item = student.evaluationItems.find(it => it.id === currentEditingItemId);
    if (item) {
      item.title = title;
      item.category = category;
    }
  } else {
    student.evaluationItems.push({
      id: 'item-' + Date.now(),
      title: title,
      category: category,
      score: 0 // Inicia en 0 (En proceso)
    });
  }

  saveState();
  closeItemModal();
  renderCurrentTab();
}

function updateItemScore(studentId, itemId, newScore) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;
  const item = (student.evaluationItems || []).find(it => it.id === itemId);
  if (item) {
    item.score = newScore;
    saveState();
    renderCurrentTab();
  }
}

// Requisito explícito: Eliminar Ítem
function confirmDeleteItem(studentId, itemId) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;

  if (confirm('¿Eliminar este ítem de trabajo de la matriz de evaluación?')) {
    student.evaluationItems = student.evaluationItems.filter(it => it.id !== itemId);
    saveState();
    renderCurrentTab();
  }
}

function downloadStudentFinalReport(studentId) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;
  alert(`Informe Final Generado por IA:\nExportando informe confidencial de ${student.alias} en formato PDF con gráfica de radar integrada.`);
}

// ================= MÓDULO 2: CALENDARIO / DIARIO DE SESIONES =================
function renderCalendarioTab(container) {
  const currentDate = appState.calendarCurrentDate || new Date().toISOString().split('T')[0];
  const dateObj = new Date(currentDate + 'T00:00:00');
  
  // Mes y Año formateado
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthName = monthNames[dateObj.getMonth()];
  const currentYear = dateObj.getFullYear();

  // Filtrar sesiones por fecha actual
  const sessionsToday = appState.sessions.filter(s => s.date === currentDate);

  let html = `
    <div class="space-y-6">
      <!-- Encabezado de Calendario / Diario -->
      <div class="glass-card rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
              <h2 class="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Diario de Aula e Histórico de Sesiones
              </h2>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">Registro ágil de intervenciones por alumno para retroalimentar al asistente IA.</p>
          </div>

          <!-- Selector de Fecha Rápido -->
          <div class="flex items-center gap-2 self-start sm:self-auto bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <button onclick="changeCalendarDay(-1)" class="scale-tap p-1.5 rounded-xl hover:bg-white text-slate-600 transition">
              <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>
            <input type="date" value="${currentDate}" onchange="setCalendarDate(this.value)" class="text-xs font-bold text-slate-800 bg-transparent border-0 focus:outline-none cursor-pointer">
            <button onclick="changeCalendarDay(1)" class="scale-tap p-1.5 rounded-xl hover:bg-white text-slate-600 transition">
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Formulario Rápido: Registrar qué se ha trabajado hoy -->
        <div class="pt-5 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <i data-lucide="edit-3" class="w-4 h-4 text-brand-orange"></i>
            <span>Nuevo Registro Rápido de Sesión (${currentDate})</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div class="sm:col-span-4">
              <label class="block text-[11px] font-bold text-slate-500 mb-1">Seleccionar Alumno:</label>
              <select id="diaryStudentSelect" class="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-brand-blue">
                ${appState.students.map(st => `
                  <option value="${st.id}" ${st.id === appState.selectedStudentId ? 'selected' : ''}>
                    ${escapeHtml(st.alias)}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="sm:col-span-8">
              <label class="block text-[11px] font-bold text-slate-500 mb-1">Qué se ha trabajado en el día:</label>
              <div class="flex gap-2">
                <input type="text" id="diaryContentInput" placeholder="Ej: Trabajo con pictos de desayuno, buena tolerancia al cambio de actividad..." 
                  onkeydown="if(event.key==='Enter') saveQuickSession()"
                  class="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white">
                <button onclick="saveQuickSession()" class="scale-tap px-4 py-2.5 rounded-2xl bg-brand-blue text-white text-xs font-bold shadow hover:bg-sky-700 transition flex items-center gap-1.5">
                  <i data-lucide="save" class="w-3.5 h-3.5"></i>
                  <span>Anotar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de Sesiones Registradas para la Fecha Seleccionada -->
      <div class="glass-card rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <i data-lucide="clock" class="w-4 h-4 text-brand-purple"></i>
            <span>Intervenciones del Día (${sessionsToday.length})</span>
          </h3>
          <span class="text-xs text-slate-400 font-medium">${monthName} ${currentYear}</span>
        </div>

        <div class="pt-4 space-y-3">
          ${sessionsToday.map(sess => {
            const student = appState.students.find(s => s.id === sess.studentId) || { alias: 'Alumno Anónimo', color: '#64748B' };
            return `
              <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm flex-shrink-0" style="background-color: ${student.color}">
                    ${student.alias.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-slate-900">${escapeHtml(student.alias)}</span>
                      <span class="text-[10px] text-slate-400 font-medium">• ${sess.date}</span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1 leading-relaxed">${escapeHtml(sess.content)}</p>
                  </div>
                </div>

                <!-- Botón de Borrado de Entrada de Diario -->
                <button onclick="confirmDeleteSession('${sess.id}')" class="scale-tap p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Eliminar Registro">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            `;
          }).join('')}

          ${sessionsToday.length === 0 ? `
            <div class="py-8 text-center text-slate-400 text-xs">
              No hay sesiones registradas en la fecha seleccionada (${currentDate}).
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function setCalendarDate(dateStr) {
  appState.calendarCurrentDate = dateStr;
  saveState();
  renderCurrentTab();
}

function changeCalendarDay(delta) {
  const current = new Date(appState.calendarCurrentDate + 'T00:00:00');
  current.setDate(current.getDate() + delta);
  appState.calendarCurrentDate = current.toISOString().split('T')[0];
  saveState();
  renderCurrentTab();
}

function saveQuickSession() {
  const studentSelect = document.getElementById('diaryStudentSelect');
  const contentInput = document.getElementById('diaryContentInput');

  if (!studentSelect || !contentInput) return;
  const studentId = studentSelect.value;
  const content = contentInput.value.trim();

  if (!content) {
    alert('Introduce las notas de la sesión antes de guardar.');
    return;
  }

  appState.sessions.unshift({
    id: 'sess-' + Date.now(),
    studentId: studentId,
    date: appState.calendarCurrentDate || new Date().toISOString().split('T')[0],
    content: content
  });

  contentInput.value = '';
  saveState();
  renderCurrentTab();
}

function confirmDeleteSession(sessionId) {
  if (confirm('¿Eliminar esta anotación del diario de sesiones?')) {
    appState.sessions = appState.sessions.filter(s => s.id !== sessionId);
    saveState();
    renderCurrentTab();
  }
}

// ================= MÓDULO 3: RECURSOS DIDÁCTICOS (2 PESTAÑAS: TRABAJO Y BIBLIOTECA + BORRADO) =================
function renderRecursosTab(container) {
  const activeSub = appState.activeResourceTab || 'trabajo';

  let html = `
    <div class="space-y-6">
      <!-- Encabezado con Conmutador de las 2 Pestañas Requeridas -->
      <div class="glass-card rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-brand-purple"></span>
              <h2 class="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Recursos Didácticos y Biblioteca
              </h2>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">Materiales organizados por áreas de trabajo y repositorio de lecturas recomendadas.</p>
          </div>

          <!-- Botón de Añadir Recurso / Añadir Libro según la pestaña activa -->
          <button onclick="openResourceModal()" class="scale-tap flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-purple-700 transition self-start sm:self-auto">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>${activeSub === 'trabajo' ? 'Añadir Material de Trabajo' : 'Añadir a Biblioteca'}</span>
          </button>
        </div>

        <!-- 2 PESTAÑAS: TRABAJO POR ÁREAS (Logo Infantil Amable) y BIBLIOTECA -->
        <div class="flex items-center gap-3 pt-4">
          <button onclick="switchResourceTab('trabajo')" class="scale-tap flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
            activeSub === 'trabajo'
              ? 'bg-brand-purple text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }">
            <span class="text-base leading-none">🎨</span>
            <span>Trabajo por Áreas (${appState.workResources.length})</span>
          </button>

          <button onclick="switchResourceTab('biblioteca')" class="scale-tap flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
            activeSub === 'biblioteca'
              ? 'bg-brand-purple text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }">
            <span class="text-base leading-none">📚</span>
            <span>Biblioteca de Libros y Cuentos (${appState.libraryBooks.length})</span>
          </button>
        </div>
      </div>

      <!-- Renderizado condicional según la pestaña de Recursos -->
      ${activeSub === 'trabajo' ? renderWorkResourcesView() : renderLibraryBooksView()}
    </div>
  `;

  container.innerHTML = html;
}

function switchResourceTab(tabKey) {
  appState.activeResourceTab = tabKey;
  saveState();
  renderCurrentTab();
}

// ---------------- RECURSOS DE TRABAJO (CLASIFICADOS POR ÁREA + BORRADO) ----------------
function renderWorkResourcesView() {
  const currentArea = appState.filterResourceArea || 'Todas';
  const filtered = currentArea === 'Todas' 
    ? appState.workResources 
    : appState.workResources.filter(r => r.area === currentArea);

  return `
    <div class="space-y-4">
      <!-- Encabezado Amable del Área de Trabajo con Icono Infantil -->
      <div class="flex items-center justify-between bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-brand-purple text-white flex items-center justify-center text-lg shadow-sm">
            🎨
          </div>
          <div>
            <h4 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Recursos de Trabajo por Áreas
            </h4>
            <p class="text-[11px] text-slate-500">Fichas didácticas, pictogramas y materiales prácticos de aula.</p>
          </div>
        </div>
        <span class="text-xs font-bold text-brand-purple bg-white px-2.5 py-1 rounded-xl border border-purple-200">
          ${filtered.length} recursos
        </span>
      </div>

      <!-- Filtro por Área de Trabajo -->
      <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
        ${RESOURCE_AREAS.map(area => `
          <button onclick="filterResourcesByArea('${area}')" class="scale-tap flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            currentArea === area 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }">
            ${area}
          </button>
        `).join('')}
      </div>

      <!-- Lista de Fichas / Materiales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${filtered.map(res => `
          <div class="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-brand-purple border border-purple-200">
                  ${escapeHtml(res.area)}
                </span>
                <!-- BOTÓN BORRAR RECURSO (Requisito explícito del usuario) -->
                <button onclick="confirmDeleteWorkResource('${res.id}')" class="scale-tap p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Eliminar Recurso">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
              <h4 class="text-sm font-bold text-slate-900 leading-snug">${escapeHtml(res.title)}</h4>
              <p class="text-xs text-slate-500 mt-2 leading-relaxed">${escapeHtml(res.description || '')}</p>
            </div>

            <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span class="text-[11px] text-slate-400 font-medium">${res.fileName || 'Ficha A4'} • ${res.fileSize || '2 MB'}</span>
              <button onclick="downloadMockDoc('${escapeHtml(res.fileName || res.title)}')" class="scale-tap flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-brand-purple text-xs font-bold hover:bg-purple-100 transition">
                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                <span>Descargar</span>
              </button>
            </div>
          </div>
        `).join('')}

        ${filtered.length === 0 ? `
          <div class="col-span-full py-12 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 text-xs">
            No hay materiales en el área seleccionada.
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function filterResourcesByArea(area) {
  appState.filterResourceArea = area;
  saveState();
  renderCurrentTab();
}

function confirmDeleteWorkResource(resId) {
  const item = appState.workResources.find(r => r.id === resId);
  if (!item) return;

  if (confirm(`¿Estás seguro de eliminar el recurso de trabajo "${item.title}"?`)) {
    appState.workResources = appState.workResources.filter(r => r.id !== resId);
    saveState();
    renderCurrentTab();
  }
}

// ---------------- BIBLIOTECA (TÍTULOS, AUTOR, FOTOS DE LIBROS/CUENTOS + BORRADO) ----------------
function renderLibraryBooksView() {
  const books = appState.libraryBooks || [];

  return `
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${books.map(b => `
          <div class="glass-card rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <!-- Foto de Portada del Libro/Cuento -->
            <div class="h-44 w-full bg-slate-100 overflow-hidden relative">
              <img src="${escapeHtml(b.coverImage || 'rtea_logo.jpg')}" alt="${escapeHtml(b.title)}" class="w-full h-full object-cover">
              <!-- BOTÓN BORRAR LIBRO DE BIBLIOTECA -->
              <button onclick="confirmDeleteLibraryBook('${b.id}')" class="scale-tap absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-rose-500 hover:text-rose-700 rounded-xl shadow-md transition" title="Eliminar Libro">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>

            <!-- Datos del Libro -->
            <div class="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 class="text-sm font-extrabold text-slate-900 leading-snug">${escapeHtml(b.title)}</h4>
                <p class="text-xs font-semibold text-brand-purple mt-0.5">${escapeHtml(b.author || 'Autor desconocido')}</p>
                <p class="text-xs text-slate-500 mt-2 leading-relaxed">${escapeHtml(b.notes || '')}</p>
              </div>

              <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Biblioteca R-TEA</span>
                <span class="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Recomendado</span>
              </div>
            </div>
          </div>
        `).join('')}

        ${books.length === 0 ? `
          <div class="col-span-full py-12 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 text-xs">
            No hay libros ni cuentos en la biblioteca. Añade el primero con el botón superior.
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function confirmDeleteLibraryBook(bookId) {
  const book = appState.libraryBooks.find(b => b.id === bookId);
  if (!book) return;

  if (confirm(`¿Eliminar de la biblioteca el libro o cuento "${book.title}"?`)) {
    appState.libraryBooks = appState.libraryBooks.filter(b => b.id !== bookId);
    saveState();
    renderCurrentTab();
  }
}

// ---------------- MODAL AÑADIR RECURSO (TRABAJO O BIBLIOTECA) ----------------
function openResourceModal() {
  const isLibrary = appState.activeResourceTab === 'biblioteca';
  const titleElem = document.getElementById('modalResourceTitle');
  const container = document.getElementById('resourceFormFields');

  if (isLibrary) {
    titleElem.innerHTML = `
      <i data-lucide="book-plus" class="w-5 h-5 text-brand-purple"></i>
      <span>Añadir Cuento o Libro a la Biblioteca</span>
    `;
    container.innerHTML = `
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Título del Cuento / Libro:</label>
        <input type="text" id="bookTitleInput" placeholder="Ej: El cazo de Lorenzo, Monstruo Rosa" class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-purple">
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Autor / Ilustrador:</label>
        <input type="text" id="bookAuthorInput" placeholder="Ej: Isabelle Carrier" class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-purple">
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Foto de Portada del Libro (o URL):</label>
        <input type="file" id="bookPhotoFileInput" accept="image/*" class="w-full text-xs text-slate-500 mb-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-brand-purple">
        <input type="text" id="bookPhotoUrlInput" placeholder="O pega una URL de imagen (opcional)" class="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Observaciones Pedagógicas / Enfoque:</label>
        <textarea id="bookNotesInput" rows="2" placeholder="Ej: Ideal para anticipar la llegada al colegio, lenguaje visual..." class="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"></textarea>
      </div>
    `;
  } else {
    titleElem.innerHTML = `
      <i data-lucide="plus-circle" class="w-5 h-5 text-brand-purple"></i>
      <span>Añadir Material de Trabajo</span>
    `;
    container.innerHTML = `
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Título del Recurso / Ficha:</label>
        <input type="text" id="workResTitleInput" placeholder="Ej: Pictogramas de Rutina de Baño" class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-purple">
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Área de Trabajo Pedagógico:</label>
        <select id="workResAreaSelect" class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
          ${RESOURCE_AREAS.filter(a => a !== 'Todas').map(a => `
            <option value="${a}">${a}</option>
          `).join('')}
        </select>
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Archivo de la Ficha (PDF / Imagen):</label>
        <input type="file" id="workResFileInput" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-brand-purple">
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Descripción / Instrucciones de Uso:</label>
        <textarea id="workResDescInput" rows="2" placeholder="Ej: Secuencia de 4 pasos con velcro para colocar en la pared del lavabo..." class="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"></textarea>
      </div>
    `;
  }

  document.getElementById('modalResource').classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeResourceModal() {
  document.getElementById('modalResource').classList.add('hidden');
}

function saveResource() {
  const isLibrary = appState.activeResourceTab === 'biblioteca';

  if (isLibrary) {
    const title = document.getElementById('bookTitleInput').value.trim();
    const author = document.getElementById('bookAuthorInput').value.trim();
    const notes = document.getElementById('bookNotesInput').value.trim();
    const urlInput = document.getElementById('bookPhotoUrlInput').value.trim();
    const fileInput = document.getElementById('bookPhotoFileInput');

    if (!title) {
      alert('Introduce el título del libro o cuento.');
      return;
    }

    let defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80';
    if (urlInput) defaultCover = urlInput;

    const newBook = {
      id: 'book-' + Date.now(),
      title: title,
      author: author || 'Autor no especificado',
      notes: notes,
      coverImage: defaultCover,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Si subió archivo de imagen, lo convertimos a dataURL para guardarlo en local
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        newBook.coverImage = e.target.result;
        appState.libraryBooks.unshift(newBook);
        saveState();
        closeResourceModal();
        renderCurrentTab();
      };
      reader.readAsDataURL(fileInput.files[0]);
      return;
    }

    appState.libraryBooks.unshift(newBook);
  } else {
    const title = document.getElementById('workResTitleInput').value.trim();
    const area = document.getElementById('workResAreaSelect').value;
    const desc = document.getElementById('workResDescInput').value.trim();
    const fileInput = document.getElementById('workResFileInput');

    if (!title) {
      alert('Introduce el título del material de trabajo.');
      return;
    }

    const file = fileInput && fileInput.files ? fileInput.files[0] : null;
    const fileName = file ? file.name : title + '.pdf';
    const fileSize = file ? Math.round(file.size / 1024) + ' KB' : '1.5 MB';

    appState.workResources.unshift({
      id: 'res-' + Date.now(),
      title: title,
      area: area,
      description: desc,
      fileName: fileName,
      fileSize: fileSize,
      createdAt: new Date().toISOString().split('T')[0]
    });
  }

  saveState();
  closeResourceModal();
  renderCurrentTab();
}

// ================= MODAL DE AYUDA Y UTILIDADES =================
function openHelpModal() {
  document.getElementById('modalHelp').classList.remove('hidden');
}

function closeHelpModal() {
  document.getElementById('modalHelp').classList.add('hidden');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ================= INICIALIZACIÓN =================
window.addEventListener('DOMContentLoaded', () => {
  renderCurrentTab();
});
