"use client"

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ChevronRight, ChevronDown, Menu, X, Search, Folder, FolderOpen, File, Hash } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'

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

function DocumentacionPage() {
    const router = useRouter();
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

    const loadDocs = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/docs')
            const data = await response.json()

            setDocs(data.docs || [])
            setGroupedDocs(data.grouped || {})
            setExpandedSections(new Set(['arquitectura', 'modulos', 'api rest']))

            if (data.docs && data.docs.length > 0) {
                setSelectedDoc(data.docs[0])
            }
        } catch (error) {
            console.error('Error loading docs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDocSelect = (doc: DocFile) => {
        setSelectedDoc(doc)
        setIsSidebarOpen(false)
        setActiveHeading("")
    }

    const handleHeadingClick = (headingId: string) => {
        const element = document.getElementById(headingId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setActiveHeading(headingId)
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
    }

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

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Cargando documentación...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header minimalista */}
                <header className="flex-shrink-0 h-14 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-lg font-semibold text-gray-900">Documentación</h1>
                        {selectedDoc && (
                            <div className="hidden sm:flex items-center text-sm text-gray-400">
                                <ChevronRight className="w-4 h-4 mx-1" />
                                <span className="text-gray-600 font-medium">{selectedDoc.title}</span>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-row gap-3'>
                        <button
                            onClick={() => router.push('/dashboard/soporte')}
                            className="flex flex-row items-center gap-2 p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-red-600" />
                            <p className="hidden sm:block text-red-700">Salir de documentación</p>
                        </button>

                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </header>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            {selectedDoc ? (
                                <motion.article
                                    key={selectedDoc.slug}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.15 }}
                                    className="p-6 md:p-8 lg:p-12"
                                >
                                    <div className="prose prose-gray max-w-none prose-headings:scroll-mt-20">
                                        <ReactMarkdown
                                            components={{
                                                code({ node, inline, className, children, ...props }: any) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <div className="my-6 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                                            <SyntaxHighlighter
                                                                style={tomorrow as any}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                className="!bg-transparent !m-0 text-sm"
                                                                customStyle={{
                                                                    padding: '1.25rem',
                                                                    background: 'transparent',
                                                                    fontSize: '0.875rem',
                                                                    lineHeight: '1.5'
                                                                }}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                },
                                                h1: ({ children }: any) => {
                                                    const text = String(children)
                                                    const id = text.toLowerCase()
                                                        .replace(/[^\w\s-]/g, '')
                                                        .replace(/\s+/g, '-')
                                                        .replace(/-+/g, '-')
                                                        .trim() + '-0'
                                                    return (
                                                        <h1 id={id} className="text-3xl font-bold text-gray-900 mt-0 mb-8 pb-4 border-b border-gray-100 scroll-mt-20">
                                                            {children}
                                                        </h1>
                                                    )
                                                },
                                                h2: ({ children }: any) => {
                                                    const text = String(children)
                                                    const index = headings.findIndex(h => h.text === text && h.level === 2)
                                                    const id = headings[index]?.id || text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                                                    return (
                                                        <h2 id={id} className="text-2xl font-semibold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                                            {children}
                                                        </h2>
                                                    )
                                                },
                                                h3: ({ children }: any) => {
                                                    const text = String(children)
                                                    const index = headings.findIndex(h => h.text === text && h.level === 3)
                                                    const id = headings[index]?.id || text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                                                    return (
                                                        <h3 id={id} className="text-xl font-medium text-gray-900 mt-8 mb-3 scroll-mt-20">
                                                            {children}
                                                        </h3>
                                                    )
                                                },
                                                h4: ({ children }: any) => {
                                                    const text = String(children)
                                                    const index = headings.findIndex(h => h.text === text && h.level === 4)
                                                    const id = headings[index]?.id || text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                                                    return (
                                                        <h4 id={id} className="text-lg font-medium text-gray-900 mt-6 mb-2 scroll-mt-20">
                                                            {children}
                                                        </h4>
                                                    )
                                                },
                                                p: ({ children }: any) => (
                                                    <p className="text-gray-700 leading-relaxed mb-6">
                                                        {children}
                                                    </p>
                                                ),
                                                ul: ({ children }: any) => (
                                                    <ul className="space-y-2 mb-6 ml-4">
                                                        {children}
                                                    </ul>
                                                ),
                                                ol: ({ children }: any) => (
                                                    <ol className="space-y-2 mb-6 ml-4">
                                                        {children}
                                                    </ol>
                                                ),
                                                li: ({ children }: any) => (
                                                    <li className="text-gray-700 leading-relaxed">
                                                        {children}
                                                    </li>
                                                ),
                                                blockquote: ({ children }: any) => (
                                                    <blockquote className="border-l-4 border-blue-200 pl-6 my-6 text-gray-600 italic bg-blue-50/50 py-4 rounded-r-lg">
                                                        {children}
                                                    </blockquote>
                                                ),
                                            }}
                                        >
                                            {selectedDoc.content}
                                        </ReactMarkdown>
                                    </div>
                                </motion.article>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-center min-h-full p-8"
                                >
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <File className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h2 className="text-xl font-medium text-gray-900 mb-2">
                                            Selecciona un documento
                                        </h2>
                                        <p className="text-gray-500 text-sm">
                                            Elige un documento del índice para comenzar
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Sidebar Derecho - Desktop */}
            <aside className="hidden md:flex md:w-72 flex-col bg-gray-50/50 border-l border-gray-100">
                {/* Header del Sidebar */}
                <div className="flex-shrink-0 p-4 border-b border-gray-100">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Lista de documentos */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                        {renderDocTree()}
                        {renderTableOfContents()}
                    </div>
                </nav>
            </aside>

            {/* Sidebar Móvil */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 flex flex-col shadow-xl md:hidden"
                        >
                            <div className="flex-shrink-0 p-4 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Índice</h2>
                                    <button
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-1">
                                    {renderDocTree()}
                                    {renderTableOfContents()}
                                </div>
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default DocumentacionPage