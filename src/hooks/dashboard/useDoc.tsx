import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Folder, FolderOpen, File, Hash } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface DocFile {
    slug: string
    title: string
    content: string
    order?: number
    section: string
    subsection?: string
    level: number
    parent?: string
    icon?: string
    description?: string
}

interface Heading {
    id: string
    text: string
    level: number
}

interface GroupedDocs {
    [key: string]: DocFile[]
}

function useDocumentation() {
    const [docs, setDocs] = useState<DocFile[]>([])
    const [groupedDocs, setGroupedDocs] = useState<GroupedDocs>({})
    const [selectedDoc, setSelectedDoc] = useState<DocFile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [activeHeading, setActiveHeading] = useState<string>("")

    // Extraer headings del contenido markdown
    const headings = useMemo(() => {
        if (!selectedDoc) return []

        const headingRegex = /^(#{1,6})\s+(.+)$/gm
        const matches = Array.from(selectedDoc.content.matchAll(headingRegex))

        return matches.map((match, index) => {
            const level = match[1].length
            const text = match[2].trim()
            const id = text.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()

            return { id: `${id}-${index}`, text, level }
        })
    }, [selectedDoc])

    useEffect(() => {
        loadDocs()
    }, [])

    // Observar scroll para highlighting automático
    useEffect(() => {
        if (!selectedDoc || headings.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id)
                        // Guardar posición actual en localStorage
                        try {
                            const savedPositions = JSON.parse(localStorage.getItem('docPositions') || '{}')
                            savedPositions[selectedDoc.slug] = entry.target.id
                            localStorage.setItem('docPositions', JSON.stringify(savedPositions))
                        } catch (error) {
                            console.error('Error saving position:', error)
                        }
                    }
                })
            },
            {
                rootMargin: '-20% 0% -80% 0%',
                threshold: 0
            }
        )

        // Observar todos los headings después de un pequeño delay
        const timeout = setTimeout(() => {
            headings.forEach(heading => {
                const element = document.getElementById(heading.id)
                if (element) observer.observe(element)
            })
        }, 100)

        return () => {
            clearTimeout(timeout)
            observer.disconnect()
        }
    }, [selectedDoc, headings])

    // Restaurar posición cuando cambia el documento seleccionado
    useEffect(() => {
        if (!selectedDoc) return

        // Restaurar posición guardada después de que el contenido se renderice
        const timeout = setTimeout(() => {
            try {
                const savedPositions = JSON.parse(localStorage.getItem('docPositions') || '{}')
                const savedHeadingId = savedPositions[selectedDoc.slug]
                
                if (savedHeadingId) {
                    const element = document.getElementById(savedHeadingId)
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        setActiveHeading(savedHeadingId)
                    }
                }
            } catch (error) {
                console.error('Error restoring position:', error)
            }
        }, 200)

        return () => clearTimeout(timeout)
    }, [selectedDoc?.slug]) // Solo depende del slug para evitar loops

    const loadDocs = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/docs')
            const data = await response.json()

            setDocs(data.docs || [])
            setGroupedDocs(data.grouped || {})
            setExpandedSections(new Set(['arquitectura', 'modulos', 'api rest']))

            // Verificar si hay un documento guardado en localStorage
            let initialDoc = null
            try {
                const savedDocSlug = localStorage.getItem('selectedDocSlug')
                if (savedDocSlug && data.docs) {
                    initialDoc = data.docs.find((doc: DocFile) => doc.slug === savedDocSlug)
                }
            } catch (error) {
                console.error('Error reading from localStorage:', error)
            }

            // Si no hay documento guardado o no se encuentra, usar el primero
            if (!initialDoc && data.docs && data.docs.length > 0) {
                initialDoc = data.docs[0]
            }

            if (initialDoc) {
                setSelectedDoc(initialDoc)
            }
        } catch (error) {
            console.error('Error loading docs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDocSelect = (doc: DocFile) => {
        // Actualizar documento seleccionado
        setSelectedDoc(doc)
        setIsSidebarOpen(false)
        setActiveHeading("")

        // Guardar selección en localStorage
        try {
            localStorage.setItem('selectedDocSlug', doc.slug)
        } catch (error) {
            console.error('Error saving selected doc:', error)
        }

        // Scroll al top del contenido
        setTimeout(() => {
            const mainContent = document.querySelector('main .flex-1.overflow-y-auto')
            if (mainContent) {
                mainContent.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }, 100)
    }

    const handleHeadingClick = (headingId: string) => {
        const element = document.getElementById(headingId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setActiveHeading(headingId)
            
            // Guardar posición en localStorage
            if (selectedDoc) {
                try {
                    const savedPositions = JSON.parse(localStorage.getItem('docPositions') || '{}')
                    savedPositions[selectedDoc.slug] = headingId
                    localStorage.setItem('docPositions', JSON.stringify(savedPositions))
                } catch (error) {
                    console.error('Error saving position:', error)
                }
            }
        }
    }

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections)
        if (newExpanded.has(section)) {
            newExpanded.delete(section)
        } else {
            newExpanded.add(section)
        }
        setExpandedSections(newExpanded)

        // Guardar secciones expandidas en localStorage
        try {
            localStorage.setItem('expandedSections', JSON.stringify(Array.from(newExpanded)))
        } catch (error) {
            console.error('Error saving expanded sections:', error)
        }
    }

    // Restaurar secciones expandidas al cargar
    useEffect(() => {
        try {
            const savedExpanded = localStorage.getItem('expandedSections')
            if (savedExpanded) {
                const parsed = JSON.parse(savedExpanded)
                setExpandedSections(new Set(parsed))
            }
        } catch (error) {
            console.error('Error loading expanded sections:', error)
        }
    }, [])

    const filteredDocs = docs.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.section.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getFilteredGroupedDocs = () => {
        if (!searchTerm) return groupedDocs

        const filtered: GroupedDocs = {}
        Object.keys(groupedDocs).forEach(section => {
            const sectionDocs = groupedDocs[section].filter(doc =>
                doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.section.toLowerCase().includes(searchTerm.toLowerCase())
            )
            if (sectionDocs.length > 0) {
                filtered[section] = sectionDocs
            }
        })
        return filtered
    }

    const renderDocTree = () => {
        const filteredGrouped = getFilteredGroupedDocs()

        return Object.keys(filteredGrouped).map((section, sectionIndex) => {
            const sectionDocs = filteredGrouped[section]
            const isExpanded = expandedSections.has(section)

            return (
                <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.05 }}
                    className="mb-1"
                >
                    <motion.button
                        onClick={() => toggleSection(section)}
                        className="w-full text-left p-2.5 rounded-lg transition-all duration-200 flex items-center group text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                        {isExpanded ? (
                            <FolderOpen className="w-4 h-4 mr-2.5 text-gray-500" />
                        ) : (
                            <Folder className="w-4 h-4 mr-2.5 text-gray-500" />
                        )}
                        <span className="flex-1 text-xs font-semibold tracking-wide uppercase">
                            {section.replace('-', ' ')}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                            }`} />
                    </motion.button>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.15 }}
                                className="ml-1 mt-0.5 space-y-0.5"
                            >
                                {sectionDocs.map((doc, docIndex) => (
                                    <motion.div
                                        key={doc.slug}
                                        initial={{ opacity: 0, x: 5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: docIndex * 0.03 }}
                                        className="ml-5"
                                    >
                                        <button
                                            onClick={() => handleDocSelect(doc)}
                                            className={`w-full text-left p-2 pl-3 rounded-md transition-all duration-200 flex items-center group text-sm border-l-2 ${selectedDoc?.slug === doc.slug
                                                ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent hover:border-gray-200'
                                                }`}
                                        >
                                            <File className="w-3.5 h-3.5 mr-2.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="truncate">{doc.title}</div>
                                                {doc.description && (
                                                    <div className="text-xs text-gray-500 truncate mt-0.5">
                                                        {doc.description}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )
        })
    }

    const renderTableOfContents = () => {
        if (headings.length === 0) return null

        return (
            <div className="border-t border-gray-100 pt-4 mt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                    En esta página
                </h3>
                <div className="space-y-1">
                    {headings.map((heading, index) => (
                        <motion.button
                            key={heading.id}
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => handleHeadingClick(heading.id)}
                            className={`w-full text-left p-1.5 px-2 rounded-md transition-all duration-200 flex items-center text-xs ${activeHeading === heading.id
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
                        >
                            <Hash className="w-3 h-3 mr-2 flex-shrink-0 opacity-60" />
                            <span className="truncate">{heading.text}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        )
    }

    return {
        isLoading,
        selectedDoc,
        isSidebarOpen,
        searchTerm,
        headings,
        renderDocTree,
        setSearchTerm,
        renderTableOfContents,
        setIsSidebarOpen,
    }
}

export default useDocumentation;