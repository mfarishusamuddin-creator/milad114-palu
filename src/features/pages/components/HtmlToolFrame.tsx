interface HtmlToolFrameProps {
  html: string;
  title: string;
}

/**
 * Render tool HTML apa adanya dalam <iframe srcDoc>.
 *
 * WAJIB pakai srcDoc (bukan dangerouslySetInnerHTML): browser tidak mengeksekusi
 * <script> yang di-inject lewat innerHTML — srcDoc me-load dokumen lengkap apa
 * adanya, termasuk semua script custom tool.
 *
 * Keamanan: karena sandbox menyertakan allow-same-origin, iframe berbagi origin
 * dengan aplikasi induk (localStorage persisten antar reload). Ini diterima —
 * semua tool ditulis sendiri oleh pemilik (bukan input pihak luar). Skrip dalam
 * tool secara teknis bisa mengakses window.parent; dokumentasikan asumsi ini,
 * jangan ditambahkan ke tool dari sumber tak dikenal.
 *
 * iframe mengisi penuh area induk (height 100%), tool scroll di dalamnya sendiri.
 */
export function HtmlToolFrame({ html, title }: HtmlToolFrameProps) {
  return (
    <iframe
      srcDoc={html}
      title={title}
      sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals allow-downloads"
      className="h-full w-full border-0 bg-background"
    />
  );
}
