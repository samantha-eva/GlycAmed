/**
 * Extraire automatiquement le prénom et le nom depuis un email
 * Exemples :
 *  - thomas.dubois@test.fr → { name: "Thomas", surname: "Dubois" }
 *  - sarah-martin@test.fr  → { name: "Sarah", surname: "Martin" }
 *  - amed@test.fr          → { name: "Amed", surname: "Amed" }
 */
export function extractNameFromEmail(email: string): { name: string; surname: string } {
  // Extraire la partie avant le @
  const localPart = email.split('@')[0];
  
  // Normaliser : remplacer tirets et underscores par des points
  const normalized = localPart.replace(/[-_]/g, '.');
  
  // Séparer par les points
  const parts = normalized.split('.');
  
  // Fonction pour capitaliser (première lettre en majuscule)
  const capitalize = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  // Si on a au moins 2 parties (prénom.nom)
  if (parts.length >= 2) {
    return {
      name: capitalize(parts[0]),
      surname: capitalize(parts[1])
    };
  }
  
  // Si une seule partie, utiliser comme prénom et nom
  if (parts.length === 1 && parts[0]) {
    const capitalized = capitalize(parts[0]);
    return {
      name: capitalized,
      surname: capitalized
    };
  }
  
  // Fallback par défaut
  return {
    name: "Utilisateur",
    surname: "GlycAmed"
  };
}