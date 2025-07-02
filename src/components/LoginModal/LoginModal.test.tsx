import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginModal from './LoginModal'; // Assurez-vous que le chemin est correct

describe('LoginModal', () => {
  // Simule la prop onLogin
  const mockOnLogin = vi.fn();

  // Réinitialise les mocks avant chaque test
  beforeEach(() => {
    vi.clearAllMocks();
    // Par défaut, simule une connexion réussie
    mockOnLogin.mockResolvedValue(undefined);
  });

  // Test 1: Le bouton pour ouvrir la modale est rendu
  it('devrait afficher le bouton "Se connecter"', () => {
    render(<LoginModal onLogin={mockOnLogin} />);
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  // Test 2: La modale s'ouvre lorsque le bouton est cliqué
  it('devrait ouvrir la modale lorsque le bouton "Se connecter" est cliqué', async () => {
    render(<LoginModal onLogin={mockOnLogin} />);

    // La modale ne devrait pas être présente initialement
    expect(screen.queryByRole('dialog', { name: /connexion/i })).not.toBeInTheDocument();

    // Clique sur le bouton pour ouvrir
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // Le contenu de la modale devrait maintenant être présent
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /connexion/i })).toBeInTheDocument();
    });
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    // Pas besoin de `exact: true` pour getByRole
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument(); // Bouton de soumission dans la modale
    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
  });

  // Test 3: La modale se ferme lorsque le bouton "Annuler" est cliqué
  it('devrait fermer la modale lorsque le bouton "Annuler" est cliqué', async () => {
    render(<LoginModal onLogin={mockOnLogin} />);

    // Ouvre d'abord la modale
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /connexion/i })).toBeInTheDocument();
    });

    // Clique sur le bouton "Annuler"
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    // La modale ne devrait plus être présente
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /connexion/i })).not.toBeInTheDocument();
    });
  });

  // Test 4: La modale se ferme lorsque la touche Échap est pressée ou le bouton de fermeture est cliqué
  it('devrait fermer la modale lorsque le bouton de fermeture est cliqué ou la touche Échap est pressée', async () => {
    render(<LoginModal onLogin={mockOnLogin} />);

    // Ouvre la modale
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /connexion/i })).toBeInTheDocument();
    });

    // Clique sur le bouton de fermeture (croix)
    fireEvent.click(screen.getByLabelText(/close/i)); // ModalCloseButton de Chakra UI a un aria-label 'Close'
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /connexion/i })).not.toBeInTheDocument();
    });

    // Ré-ouvre la modale pour tester la touche Échap
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /connexion/i })).toBeInTheDocument();
    });

    // Appuie sur la touche Échap
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /connexion/i })).not.toBeInTheDocument();
    });
  });

  // Test 5: La soumission du formulaire appelle onLogin avec les bonnes identifiants et ferme la modale en cas de succès
  it('devrait appeler onLogin avec les identifiants et fermer la modale en cas de succès', async () => {
    render(<LoginModal onLogin={mockOnLogin} />);

    // Ouvre la modale
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /connexion/i })).toBeInTheDocument();
    });

    // Tape dans les champs de saisie
    fireEvent.change(screen.getByLabelText(/login/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

    // Soumet le formulaire
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // onLogin devrait avoir été appelé
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
      expect(mockOnLogin).toHaveBeenCalledWith({ login: 'testuser', password: 'password123' });
    });

    // La modale devrait se fermer
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /connexion/i })).not.toBeInTheDocument();
    });

    // Les champs de saisie devraient être effacés
    expect(screen.queryByDisplayValue('testuser')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('password123')).not.toBeInTheDocument();
  });

  // Test 6: Affiche un message d'erreur en cas d'échec de connexion
  it('devrait afficher un message d\'erreur en cas d\'échec de connexion', async () => {
    const errorMessage = 'Identifiants invalides fournis.';
    mockOnLogin.mockRejectedValue(new Error(errorMessage)); // Simule un échec de connexion

    render(<LoginModal onLogin={mockOnLogin} />);

    // Ouvre la modale
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /connexion/i })).toBeInTheDocument();
    });

    // Tape dans les champs de saisie
    fireEvent.change(screen.getByLabelText(/login/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'wrong' } });

    // Soumet le formulaire
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // onLogin devrait avoir été appelé
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    // Le message d'erreur devrait être affiché
    await waitFor(() => { // Added waitFor here
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    // La modale devrait rester ouverte
    expect(screen.queryByRole('dialog', { name: /connexion/i })).toBeInTheDocument();
  });

  // Test 7: Le message d'erreur se vide lorsque la modale est fermée et rouverte
  it('devrait effacer le message d\'erreur lorsque la modale est fermée et rouverte', async () => {
    const errorMessage = 'Identifiants invalides fournis.';
    mockOnLogin.mockRejectedValue(new Error(errorMessage));

    render(<LoginModal onLogin={mockOnLogin} />);

    // 1. Ouvre la modale
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // 2. Tape les identifiants pour que la soumission soit considérée
    fireEvent.change(screen.getByLabelText(/login/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'pass' } });

    // 3. Soumet le formulaire, ce qui devrait provoquer une erreur
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // 4. Attend que le message d'erreur apparaisse
    await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // 5. Ferme la modale
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    // 6. Ré-ouvre la modale
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // 7. Le message d'erreur ne devrait plus être présent
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  // Test 8: L'état de chargement désactive les champs de saisie et les boutons
  it('devrait désactiver les champs de saisie et les boutons pendant le chargement', async () => {
    // Utilise une promesse manuelle pour contrôler l'état de chargement
    let resolveLoginPromise: (value?: unknown) => void;
    mockOnLogin.mockImplementation(() => new Promise((resolve) => {
      resolveLoginPromise = resolve;
    }));

    render(<LoginModal onLogin={mockOnLogin} />);

    // Ouvre la modale
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // Tape dans les champs de saisie
    fireEvent.change(screen.getByLabelText(/login/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'pass' } });

    // Soumet le formulaire (déclenche isLoading à true)
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // Vérifie que les champs de saisie et les boutons sont désactivés
    await waitFor(() => {
      expect(screen.getByLabelText(/login/i)).toBeDisabled();
      expect(screen.getByLabelText(/mot de passe/i)).toBeDisabled();
      // Le bouton de soumission devrait maintenant avoir le texte de chargement
      expect(screen.getByRole('button', { name: /connexion\.\.\./i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /annuler/i })).toBeDisabled();
      // Vérifie que le texte du spinner de chargement est visible
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    // Résout la promesse pour terminer le chargement
    resolveLoginPromise!();

    // Après la résolution, les éléments devraient être réactivés et la modale fermée
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    // Vérifie que le bouton d'ouverture de la modale est réactivé
    expect(screen.getByRole('button', { name: /se connecter/i })).not.toBeDisabled();
  });
});