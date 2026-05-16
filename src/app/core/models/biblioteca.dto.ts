// ─── DTOs for Alarido Biblioteca API (/api/biblioteca) ───────────────────────

export interface BibliotecaColecaoResponseDTO {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  idioma: string;
  criadoEm: string;
}

export interface BibliotecaObraResponseDTO {
  id: string;
  colecaoId: string;
  titulo: string;
  tituloOriginal: string;
  slug: string;
  autor: string;
  tipoObra: string;
  codigo: string;
  idioma: string;
  dataPregacao: string;
  local: string;
  descricao: string;
  urlCapa: string;
  tipoArquivoOrigem: string;
  totalSecoes: number;
  totalParagrafos: number;
  status: string;
  criadoEm: string;
}

export interface BibliotecaSecaoResponseDTO {
  id: string;
  obraId: string;
  titulo: string;
  numeroSecao: number;
  referencia: string;
}

export interface BibliotecaParagrafoResponseDTO {
  id: string;
  secaoId: string;
  numeroParagrafo: number;
  referenciaTitulo: string;
  conteudo: string;
  paginaInicio: number | null;
  paginaFim: number | null;
}

export interface BibliotecaResultadoBuscaResponseDTO {
  obraId: string;
  titulo: string;
  numeroParagrafo: number;
  conteudo: string;
}

export type ImportacaoStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface BibliotecaImportacaoResponseDTO {
  id: string;
  nomeArquivo: string;
  tipoArquivo: string;
  status: ImportacaoStatus;
  obraId: string | null;
  totalItens: number;
  itensImportados: number;
  mensagemErro: string | null;
  iniciadoEm: string | null;
  finalizadoEm: string | null;
  criadoEm: string;
}
