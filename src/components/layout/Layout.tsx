import { Container, Box } from '@mui/material';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0, padding: 0 }}>
      <Header />
      <Container sx={{ mt: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 