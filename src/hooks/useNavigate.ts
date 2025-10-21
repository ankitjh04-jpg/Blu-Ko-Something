import { useState } from 'react';

type Page = 'dashboard' | 'profile' | 'chatbot' | 'resume';

export function useNavigate() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  return { currentPage, navigate };
}
