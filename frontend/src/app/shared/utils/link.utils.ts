export function createSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD') // sépare les lettres de leurs accents
        .replace(/[\u0300-\u036f]/g, '') // accents -> remove
        .replace(/\s+/g, '-') // cherche les espaces -> -
        .replace(/[^\w-]+/g, ''); // remove tous les caractères spéciaux
}

export function buildGoogleSearchUrl(name: string, address: string): string {
  const query = encodeURIComponent(`${name} ${address}`);
  return `https://www.google.com/search?q=${query}`;
}