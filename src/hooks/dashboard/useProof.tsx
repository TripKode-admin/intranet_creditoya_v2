"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ScalarClient } from '@/types/client';

interface GeneratedDocument {
  id: string;
  loanId: string;
  uploadId: string;
  publicUrl: string;
  documentTypes: string[];
  created_at: string;
  updated_at: string;
  downloadCount: number;
  lastDownloaded?: string;
}

export interface DocumentWithLoan {
  document: GeneratedDocument;
  loanApplication: {
    id: string;
    status: string;
    amount: number;
    created_at: string;
    user: ScalarClient;
  };
  downloadCount: number;
  lastDownloaded?: string;
}

interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

function useProof() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [neverDownloadedDocuments, setNeverDownloadedDocuments] = useState<DocumentWithLoan[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Estados para paginación
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchNeverDownloadedDocuments();
  }, []);

  const fetchNeverDownloadedDocuments = async (
    page?: number,
    limit?: number
  ): Promise<{ documents: any[], pagination: PaginationInfo }> => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('page', (page || pagination.currentPage).toString());
      params.append('limit', (limit || pagination.limit).toString());

      const url = `/api/dash/pdfs/never-downloaded?${params.toString()}`;

      const response = await axios.get(url, { withCredentials: true });

      const result = {
        documents: response.data.data,
        pagination: response.data.pagination
      };

      setNeverDownloadedDocuments(result.documents);
      setPagination(result.pagination);

      return result;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al obtener documentos no descargados');
      }
      return {
        documents: [],
        pagination: {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 10
        }
      };
    } finally {
      setLoading(false);
    }
  };

  const downloadDocumentById = async (documentId: string) => {
    try {
      const response = await axios.get(`/api/dash/pdfs/document?document_id=${documentId}`, {
        withCredentials: true,
        responseType: 'blob'
      });

      if (!response.data) {
        throw new Error(`Error en la descarga: ${response.status}`);
      }

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `document_${documentId}.pdf`;

      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refrescar lista después de la descarga
      await fetchNeverDownloadedDocuments();

      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al descargar documento');
      }
      return false;
    }
  };

  const getFullName = (user: ScalarClient) => {
    return `${user.names} ${user.firstLastName} ${user.secondLastName || ''}`.trim();
  };

  const handleToggleDownload = async () => {
    setIsDownloaded(true);

    try {
      // Usar neverDownloadedDocuments para descargar cada documento
      for (const doc of neverDownloadedDocuments) {
        await downloadDocumentById(doc.document.id);
      }

      // Refrescar la lista después de las descargas
      await fetchNeverDownloadedDocuments();

      setIsDownloaded(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al descargar los documentos');
      }
      setIsDownloaded(false);
    }
  };

  // Manejo de la selección/deselección de documentos
  const toggleDocumentSelection = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  // Descargar todos los documentos seleccionados
  const handleDownloadSelected = async () => {
    for (const documentId of selectedDocuments) {
      await downloadDocumentById(documentId);
    }
    setSelectedDocuments([]);
  };

  // Navegación de páginas
  const handlePageChange = async (page: number) => {
    await fetchNeverDownloadedDocuments(page, pagination.limit);
  };

  // Navegación específica
  const goToFirstPage = () => handlePageChange(1);

  const goToLastPage = () => handlePageChange(pagination.totalPages);

  const goToNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  // Seleccionar/deseleccionar todos los documentos de la página actual
  const toggleSelectAll = () => {
    const currentPageDocumentIds = neverDownloadedDocuments.map(doc => doc.document.id);
    const allSelected = currentPageDocumentIds.every(id => selectedDocuments.includes(id));

    if (allSelected) {
      // Deseleccionar todos los de la página actual
      setSelectedDocuments(selectedDocuments.filter(id => !currentPageDocumentIds.includes(id)));
    } else {
      // Seleccionar todos los de la página actual
      const newSelected = [...selectedDocuments];
      currentPageDocumentIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      setSelectedDocuments(newSelected);
    }
  };

  return {
    loading,
    error,
    neverDownloadedDocuments,
    selectedDocuments,
    pagination,
    isDownloaded,
    getFullName,
    downloadDocumentById,
    handleToggleDownload,
    toggleDocumentSelection,
    handleDownloadSelected,
    handlePageChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
    toggleSelectAll,
  };
}

export default useProof;