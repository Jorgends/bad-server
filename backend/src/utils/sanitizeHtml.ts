const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
}

export default function sanitizeHtml(value: string) {
    return value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char])
}
