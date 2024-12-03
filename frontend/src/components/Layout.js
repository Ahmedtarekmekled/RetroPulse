import Terminal from './Terminal';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      {children}
      <Terminal />
    </div>
  );
}

export default Layout; 