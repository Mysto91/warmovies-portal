import './App.css';
import ArticleTable from './components/ArticleTable';

function App() {
  return (
    <div>
      <ArticleTable loading={true}></ArticleTable>
      <ArticleTable></ArticleTable>
    </div>
  );
}

export default App;
