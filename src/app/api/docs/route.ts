import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface Doc {
    slug: string
    title: string
    content: string
    order: number
    section: string
    subsection?: string
    level: number
    parent?: string
    icon?: string
    description?: string
    sectionOrder?: number // Nuevo campo para ordenar secciones
}

interface GroupedDocs {
    [section: string]: Doc[]
}

// Define el orden personalizado de las secciones
const SECTION_ORDER: { [key: string]: number } = {
    'arquitectura': 1,
    'infraestructura': 2,
    'seguridad': 3,
    'base de datos': 4,
    'modulos': 5,
    'api rest': 6,
    'herramientas y utilidades': 7,
    'pruebas': 8,
    'monitoreo y mantenimiento': 9,
    'procedimientos operativos': 10,
    'consideraciones legales': 11,
}

export async function GET() {
    try {
        const docsDirectory = path.join(process.cwd(), 'docs')

        // Crear directorio si no existe
        if (!fs.existsSync(docsDirectory)) {
            fs.mkdirSync(docsDirectory, { recursive: true })
        }

        const docs: Doc[] = []

        function readDocsRecursively(dir: string, parentPath: string = ''): void {
            const items: string[] = fs.readdirSync(dir)

            items.forEach((item: string) => {
                const fullPath: string = path.join(dir, item)
                const stat: fs.Stats = fs.statSync(fullPath)

                if (stat.isDirectory()) {
                    // Es una carpeta, leer recursivamente
                    readDocsRecursively(fullPath, parentPath ? `${parentPath}/${item}` : item)
                } else if (item.endsWith('.md')) {
                    // Es un archivo markdown
                    const fileContents: string = fs.readFileSync(fullPath, 'utf8')
                    const { data, content }: { data: Record<string, any>, content: string } = matter(fileContents)

                    const slug: string = parentPath
                        ? `${parentPath}/${item.replace('.md', '')}`
                        : item.replace('.md', '')

                    const section = data.section || parentPath || 'general'

                    docs.push({
                        slug,
                        title: data.title || item.replace('.md', ''),
                        content,
                        order: data.order || 999,
                        section: section,
                        subsection: data.subsection,
                        level: data.level || (parentPath ? parentPath.split('/').length + 1 : 1),
                        parent: data.parent || parentPath,
                        icon: data.icon,
                        description: data.description,
                        sectionOrder: data.sectionOrder || SECTION_ORDER[section.toLowerCase()] || 999
                    })
                }
            })
        }

        readDocsRecursively(docsDirectory)

        // Ordenar documentos por sección (usando orden personalizado), orden y título
        const sortedDocs = docs.sort((a, b) => {
            // Primero por orden de sección personalizado
            const sectionOrderA = a.sectionOrder || SECTION_ORDER[a.section.toLowerCase()] || 999
            const sectionOrderB = b.sectionOrder || SECTION_ORDER[b.section.toLowerCase()] || 999
            
            if (sectionOrderA !== sectionOrderB) {
                return sectionOrderA - sectionOrderB
            }
            
            // Si tienen el mismo orden de sección, ordenar alfabéticamente por sección
            if (a.section !== b.section) {
                return a.section.localeCompare(b.section)
            }
            
            // Luego por orden del documento
            if (a.order !== b.order) {
                return a.order - b.order
            }
            
            // Finalmente por título
            return a.title.localeCompare(b.title)
        })

        // Agrupar por secciones para el frontend (manteniendo el orden)
        const groupedDocs = groupDocsBySection(sortedDocs)

        return NextResponse.json({
            docs: sortedDocs,
            grouped: groupedDocs
        })
    } catch (error) {
        console.error('Error reading docs:', error)
        return NextResponse.json({ error: 'Error loading documentation' }, { status: 500 })
    }
}

function groupDocsBySection(docs: Doc[]): GroupedDocs {
    const grouped: GroupedDocs = {}
    
    // Crear un mapa para mantener el orden de las secciones
    const sectionOrderMap = new Map<string, number>()

    docs.forEach((doc: Doc) => {
        const section: string = doc.section || 'general'
        
        // Registrar el orden de la sección si no está registrado
        if (!sectionOrderMap.has(section)) {
            const sectionOrder = doc.sectionOrder || SECTION_ORDER[section.toLowerCase()] || 999
            sectionOrderMap.set(section, sectionOrder)
        }
        
        if (!grouped[section]) {
            grouped[section] = []
        }
        grouped[section].push(doc)
    })

    // Convertir a array, ordenar por sección y convertir de vuelta a objeto
    const sortedSections = Array.from(sectionOrderMap.entries())
        .sort(([, orderA], [, orderB]) => orderA - orderB)
        .map(([section]) => section)

    const orderedGrouped: GroupedDocs = {}
    sortedSections.forEach(section => {
        if (grouped[section]) {
            orderedGrouped[section] = grouped[section]
        }
    })

    return orderedGrouped
}