// Mock data for Budget Pro application

export interface Demande {
  id: string;
  service: string;
  domaine: string;
  categorie: 'Fonctionnement' | 'Investissement';
  description: string;
  justification: string;
  budgetTitre: number;
  budgetValide: number;
  statut: 'Brouillon' | 'En attente' | 'Validé' | 'Rejeté';
  dateCreation: string;
}

export interface Operation {
  id: string;
  nom: string;
  description: string;
  budgetPrevu: number;
  depenses: number;
  periode: string;
  statut: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé';
}

export interface Depense {
  id: string;
  date: string;
  libelle: string;
  montant: number;
  type: 'Fonctionnement' | 'Investissement';
  rattachement: string;
  rattachementType: 'demande' | 'operation';
}

export interface Campagne {
  id: string;
  nom: string;
  periode: string;
  dateDebut: string;
  dateFin: string;
  etat: 'Ouvert' | 'Clôturé' | 'En préparation';
}

export interface Service {
  id: string;
  nom: string;
  responsable: string;
  email: string;
}

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  service: string;
  role: 'Admin' | 'Lecteur' | 'Éditeur';
}

export const services: Service[] = [
  { id: '1', nom: 'Direction', responsable: 'Anne GAVARD', email: 'direction@commune.fr' },
  { id: '2', nom: 'Service Technique', responsable: 'Pierre MARTIN', email: 'technique@commune.fr' },
  { id: '3', nom: 'Finances', responsable: 'Marie DUPONT', email: 'finances@commune.fr' },
  { id: '4', nom: 'Accueil à la population', responsable: 'Jean DURAND', email: 'accueil@commune.fr' },
  { id: '5', nom: 'Ressources humaines', responsable: 'Sophie BERNARD', email: 'rh@commune.fr' },
  { id: '6', nom: 'Médiathèque', responsable: 'Claire PETIT', email: 'mediatheque@commune.fr' },
  { id: '7', nom: 'Enfance jeunesse', responsable: 'Luc MOREAU', email: 'enfance@commune.fr' },
  { id: '8', nom: 'Restauration scolaire', responsable: 'Nathalie ROUX', email: 'restauration@commune.fr' },
];

export const demandes: Demande[] = [
  {
    id: '1',
    service: 'Direction',
    domaine: 'Administration générale',
    categorie: 'Fonctionnement',
    description: 'Acquisition de matériel informatique pour le secrétariat',
    justification: 'Renouvellement équipements obsolètes',
    budgetTitre: 15000,
    budgetValide: 12000,
    statut: 'Validé',
    dateCreation: '2024-01-15',
  },
  {
    id: '2',
    service: 'Service Technique',
    domaine: 'Voirie',
    categorie: 'Investissement',
    description: 'Réfection de la rue principale',
    justification: 'Dégradation importante de la chaussée',
    budgetTitre: 85000,
    budgetValide: 0,
    statut: 'En attente',
    dateCreation: '2024-02-01',
  },
  {
    id: '3',
    service: 'Médiathèque',
    domaine: 'Culture',
    categorie: 'Fonctionnement',
    description: 'Acquisition de nouveaux ouvrages et abonnements',
    justification: 'Enrichissement du fonds documentaire',
    budgetTitre: 8500,
    budgetValide: 8500,
    statut: 'Validé',
    dateCreation: '2024-02-10',
  },
  {
    id: '4',
    service: 'Enfance jeunesse',
    domaine: 'Éducation',
    categorie: 'Fonctionnement',
    description: 'Activités périscolaires et sorties éducatives',
    justification: 'Programme annuel d\'animation',
    budgetTitre: 25000,
    budgetValide: 0,
    statut: 'Brouillon',
    dateCreation: '2024-02-15',
  },
  {
    id: '5',
    service: 'Restauration scolaire',
    domaine: 'Éducation',
    categorie: 'Investissement',
    description: 'Rénovation de la cuisine centrale',
    justification: 'Mise aux normes sanitaires',
    budgetTitre: 120000,
    budgetValide: 100000,
    statut: 'Validé',
    dateCreation: '2024-01-20',
  },
  {
    id: '6',
    service: 'Finances',
    domaine: 'Administration',
    categorie: 'Fonctionnement',
    description: 'Formation du personnel comptable',
    justification: 'Évolution réglementaire M57',
    budgetTitre: 3500,
    budgetValide: 0,
    statut: 'Rejeté',
    dateCreation: '2024-02-20',
  },
];

export const operations: Operation[] = [
  {
    id: '1',
    nom: 'Rénovation église Saint-Martin',
    description: 'Restauration de la toiture et des vitraux',
    budgetPrevu: 450000,
    depenses: 125000,
    periode: '2024-2026',
    statut: 'En cours',
  },
  {
    id: '2',
    nom: 'Sécurisation routière St Etrope et Bocquereux',
    description: 'Installation de ralentisseurs et signalétique',
    budgetPrevu: 23000,
    depenses: 0,
    periode: '2024',
    statut: 'Planifié',
  },
  {
    id: '3',
    nom: 'Construction de la nouvelle école',
    description: 'Bâtiment scolaire 8 classes avec cantine',
    budgetPrevu: 2500000,
    depenses: 1800000,
    periode: '2022-2024',
    statut: 'En cours',
  },
  {
    id: '4',
    nom: 'Aménagement du parc municipal',
    description: 'Création d\'aires de jeux et espaces verts',
    budgetPrevu: 180000,
    depenses: 180000,
    periode: '2023',
    statut: 'Terminé',
  },
  {
    id: '5',
    nom: 'Réhabilitation de la mairie annexe',
    description: 'Mise aux normes accessibilité et énergétique',
    budgetPrevu: 350000,
    depenses: 45000,
    periode: '2024-2025',
    statut: 'En cours',
  },
];

export const depenses: Depense[] = [
  {
    id: '1',
    date: '2024-02-15',
    libelle: 'Achat ordinateurs Dell',
    montant: 4500,
    type: 'Fonctionnement',
    rattachement: 'Direction - Matériel informatique',
    rattachementType: 'demande',
  },
  {
    id: '2',
    date: '2024-02-10',
    libelle: 'Travaux toiture église - Phase 1',
    montant: 75000,
    type: 'Investissement',
    rattachement: 'Rénovation église Saint-Martin',
    rattachementType: 'operation',
  },
  {
    id: '3',
    date: '2024-02-08',
    libelle: 'Livres et DVD médiathèque',
    montant: 2300,
    type: 'Fonctionnement',
    rattachement: 'Médiathèque - Ouvrages',
    rattachementType: 'demande',
  },
  {
    id: '4',
    date: '2024-02-05',
    libelle: 'Équipements cuisine scolaire',
    montant: 35000,
    type: 'Investissement',
    rattachement: 'Rénovation cuisine centrale',
    rattachementType: 'demande',
  },
  {
    id: '5',
    date: '2024-02-01',
    libelle: 'Travaux église - Vitraux',
    montant: 50000,
    type: 'Investissement',
    rattachement: 'Rénovation église Saint-Martin',
    rattachementType: 'operation',
  },
  {
    id: '6',
    date: '2024-01-28',
    libelle: 'Construction école - Lot gros œuvre',
    montant: 450000,
    type: 'Investissement',
    rattachement: 'Construction nouvelle école',
    rattachementType: 'operation',
  },
];

export const campagnes: Campagne[] = [
  {
    id: '1',
    nom: 'Budget 2024',
    periode: '2024',
    dateDebut: '2023-09-01',
    dateFin: '2023-12-15',
    etat: 'Clôturé',
  },
  {
    id: '2',
    nom: 'Budget 2025',
    periode: '2025',
    dateDebut: '2024-09-01',
    dateFin: '2024-12-15',
    etat: 'Ouvert',
  },
  {
    id: '3',
    nom: 'Budget 2026',
    periode: '2026',
    dateDebut: '2025-09-01',
    dateFin: '2025-12-15',
    etat: 'En préparation',
  },
];

export const utilisateurs: Utilisateur[] = [
  { id: '1', nom: 'Anne GAVARD', email: 'a.gavard@commune.fr', service: 'Direction', role: 'Admin' },
  { id: '2', nom: 'Pierre MARTIN', email: 'p.martin@commune.fr', service: 'Service Technique', role: 'Éditeur' },
  { id: '3', nom: 'Marie DUPONT', email: 'm.dupont@commune.fr', service: 'Finances', role: 'Éditeur' },
  { id: '4', nom: 'Jean DURAND', email: 'j.durand@commune.fr', service: 'Accueil à la population', role: 'Lecteur' },
  { id: '5', nom: 'Sophie BERNARD', email: 's.bernard@commune.fr', service: 'Ressources humaines', role: 'Éditeur' },
];

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Calculate totals
export const getTotals = () => {
  const budgetDemande = demandes.reduce((sum, d) => sum + d.budgetTitre, 0);
  const budgetValide = demandes.reduce((sum, d) => sum + d.budgetValide, 0);
  const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);
  const resteADepenser = budgetValide - totalDepenses;

  return {
    budgetDemande,
    budgetValide,
    totalDepenses,
    resteADepenser,
  };
};
