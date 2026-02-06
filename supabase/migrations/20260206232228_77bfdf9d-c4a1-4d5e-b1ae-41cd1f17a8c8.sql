-- Table des demandes budgétaires
CREATE TABLE public.demandes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL,
  domaine TEXT NOT NULL DEFAULT '',
  categorie TEXT NOT NULL CHECK (categorie IN ('Fonctionnement', 'Investissement')),
  description TEXT NOT NULL DEFAULT '',
  justification TEXT NOT NULL DEFAULT '',
  budget_titre NUMERIC NOT NULL DEFAULT 0,
  budget_valide NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'Brouillon' CHECK (statut IN ('Brouillon', 'En attente', 'Validé', 'Rejeté')),
  date_creation DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des opérations
CREATE TABLE public.operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  budget_prevu NUMERIC NOT NULL DEFAULT 0,
  depenses NUMERIC NOT NULL DEFAULT 0,
  periode TEXT NOT NULL DEFAULT '',
  statut TEXT NOT NULL DEFAULT 'Planifié' CHECK (statut IN ('Planifié', 'En cours', 'Terminé', 'Annulé')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des dépenses
CREATE TABLE public.depenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL,
  operation TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL DEFAULT '',
  montant_ttc NUMERIC NOT NULL DEFAULT 0,
  fournisseur TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (access libre = tout le monde peut lire/écrire)
ALTER TABLE public.demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depenses ENABLE ROW LEVEL SECURITY;

-- Policies pour accès public (lecture et écriture pour tous)
CREATE POLICY "Accès public lecture demandes" ON public.demandes FOR SELECT USING (true);
CREATE POLICY "Accès public insertion demandes" ON public.demandes FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public modification demandes" ON public.demandes FOR UPDATE USING (true);
CREATE POLICY "Accès public suppression demandes" ON public.demandes FOR DELETE USING (true);

CREATE POLICY "Accès public lecture operations" ON public.operations FOR SELECT USING (true);
CREATE POLICY "Accès public insertion operations" ON public.operations FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public modification operations" ON public.operations FOR UPDATE USING (true);
CREATE POLICY "Accès public suppression operations" ON public.operations FOR DELETE USING (true);

CREATE POLICY "Accès public lecture depenses" ON public.depenses FOR SELECT USING (true);
CREATE POLICY "Accès public insertion depenses" ON public.depenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public modification depenses" ON public.depenses FOR UPDATE USING (true);
CREATE POLICY "Accès public suppression depenses" ON public.depenses FOR DELETE USING (true);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_demandes_updated_at
  BEFORE UPDATE ON public.demandes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operations_updated_at
  BEFORE UPDATE ON public.operations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_depenses_updated_at
  BEFORE UPDATE ON public.depenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();