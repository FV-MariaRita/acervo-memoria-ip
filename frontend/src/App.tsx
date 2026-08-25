import Header from './components/Header';
import Footer from './components/Footer';
import './App.css'
import ListaEntrevistados from './components/ListaEntrevistados';


function App() {
  
  return (
    <div className='flex flex-col min-h-screen ' >
      <Header />

      <main className='flex flex-col grow items-center py-2 mx-12'>
          <ListaEntrevistados />
      </main>
      
      <Footer />
    </div>
  )
}

export default App
