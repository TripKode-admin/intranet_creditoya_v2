"use client"

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ChevronRight, ChevronDown, FileText, Menu, X, Search, Folder, FolderOpen, File } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"

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

interface GroupedDocs {
    [key: string]: DocFile[]
}

function DocumentacionPage() {
    const [docs, setDocs] = useState<DocFile[]>([])
    const [groupedDocs, setGroupedDocs] = useState<GroupedDocs>({})
    const [selectedDoc, setSelectedDoc] = useState<DocFile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

    useEffect(() => {
        loadDocs()
    }, [])

    const loadDocs = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/docs')
            const data = await response.json()

            setDocs(data.docs || [])
            setGroupedDocs(data.grouped || {})

            // Expandir todas las secciones por defecto
            setExpandedSections(new Set(Object.keys(data.grouped || {})))

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

    const renderDocTree = (docs: DocFile[], isDesktop = true) => {
        const filteredGrouped = getFilteredGroupedDocs()

        return Object.keys(filteredGrouped).map((section, sectionIndex) => {
            const sectionDocs = filteredGrouped[section]
            const isExpanded = expandedSections.has(section)

            return (
                <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                    className="mb-2"
                >
                    {/* Encabezado de Sección */}
                    <motion.button
                        onClick={() => toggleSection(section)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center group text-sm font-medium ${isDesktop
                                ? 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-gray-900'
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                            }`}
                    >
                        {isExpanded ? (
                            <FolderOpen className="w-4 h-4 mr-3 text-gray-500" />
                        ) : (
                            <Folder className="w-4 h-4 mr-3 text-gray-500" />
                        )}
                        <span className="flex-1 capitalize">{section.replace('-', ' ')}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                            }`} />
                    </motion.button>

                    {/* Documentos de la Sección */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 mt-1 space-y-1"
                            >
                                {sectionDocs.map((doc, docIndex) => (
                                    <motion.button
                                        key={doc.slug}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: docIndex * 0.05 }}
                                        onClick={() => handleDocSelect(doc)}
                                        className={`w-full text-left p-2.5 rounded-lg transition-all duration-200 flex items-center group text-sm ${selectedDoc?.slug === doc.slug
                                                ? isDesktop
                                                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                                    : 'bg-gray-50 text-gray-900'
                                                : isDesktop
                                                    ? 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        style={{ paddingLeft: `${doc.level * 12 + 8}px` }}
                                    >
                                        <File className="w-3.5 h-3.5 mr-3 text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{doc.title}</div>
                                            {doc.description && (
                                                <div className="text-xs text-gray-500 truncate mt-0.5">
                                                    {doc.description}
                                                </div>
                                            )}
                                        </div>
                                        <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${selectedDoc?.slug === doc.slug ? 'rotate-90' : 'group-hover:translate-x-0.5'
                                            }`} />
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )
        })
    }

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm font-medium">Cargando documentación...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="flex-shrink-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
                    <div className="flex items-center space-x-4">
                        <motion.h1
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-lg font-semibold text-gray-900"
                        >
                            Documentación
                        </motion.h1>
                        {selectedDoc && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="hidden sm:flex items-center text-sm text-gray-500"
                            >
                                <ChevronRight className="w-4 h-4 mx-2" />
                                <span className="text-gray-400 capitalize">{selectedDoc.section.replace('-', ' ')}</span>
                                <ChevronRight className="w-4 h-4 mx-2" />
                                <span className="font-medium">{selectedDoc.title}</span>
                            </motion.div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                </header>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            {selectedDoc ? (
                                <motion.article
                                    key={selectedDoc.slug}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="p-8 md:p-12"
                                >
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700"
                                    >
                                        <ReactMarkdown
                                            components={{
                                                code({ node, inline, className, children, ...props }: any) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <div className="my-6 overflow-hidden rounded-xl border border-gray-100">
                                                            <SyntaxHighlighter
                                                                style={tomorrow as any}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                className="!bg-gray-50 !m-0 text-sm"
                                                                customStyle={{
                                                                    padding: '1.25rem',
                                                                    background: '#f8fafc',
                                                                    fontSize: '0.875rem',
                                                                    lineHeight: '1.5'
                                                                }}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                },
                                                h1: ({ children }: any) => (
                                                    <h1 className="text-3xl font-bold text-gray-900 mt-0 mb-8 pb-4 border-b border-gray-100">
                                                        {children}
                                                    </h1>
                                                ),
                                                h2: ({ children }: any) => (
                                                    <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
                                                        {children}
                                                    </h2>
                                                ),
                                                h3: ({ children }: any) => (
                                                    <h3 className="text-xl font-medium text-gray-900 mt-8 mb-3">
                                                        {children}
                                                    </h3>
                                                ),
                                                h4: ({ children }: any) => (
                                                    <h4 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                                                        {children}
                                                    </h4>
                                                ),
                                                p: ({ children }: any) => (
                                                    <p className="text-gray-700 leading-relaxed mb-6 text-base">
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
                                                    <blockquote className="border-l-3 border-gray-200 pl-6 my-6 text-gray-600 italic bg-gray-50 py-4 rounded-r-lg">
                                                        {children}
                                                    </blockquote>
                                                ),
                                                table: ({ children }: any) => (
                                                    <div className="overflow-x-auto my-6">
                                                        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                                                            {children}
                                                        </table>
                                                    </div>
                                                ),
                                                th: ({ children }: any) => (
                                                    <th className="bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                        {children}
                                                    </th>
                                                ),
                                                td: ({ children }: any) => (
                                                    <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                                                        {children}
                                                    </td>
                                                ),
                                            }}
                                        >
                                            {selectedDoc.content}
                                        </ReactMarkdown>
                                    </motion.div>
                                </motion.article>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-center min-h-full p-8"
                                >
                                    <div className="text-center">
                                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
            <aside className="hidden md:flex md:w-80 flex-col bg-gray-50 border-l border-gray-100">
                {/* Header del Sidebar */}
                <div className="flex-shrink-0 p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Índice</h2>

                    {/* Buscador */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Lista de documentos */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                        {renderDocTree(docs, true)}
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
                            {/* Header móvil */}
                            <div className="flex-shrink-0 p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Índice</h2>
                                    <button
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Buscador móvil */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar documentos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Lista de documentos móvil */}
                            <nav className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-1">
                                    {renderDocTree(docs, false)}
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