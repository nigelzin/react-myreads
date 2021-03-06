import React from 'react'
import { Route } from 'react-router-dom'
import * as BooksAPI from './utils/BooksAPI'
import ListMyReads from './components/ListMyReads'
import './App.css'
import Search from './components/Search';

class BooksApp extends React.Component {

  state = {
    books: [],
    resultBooks: []
  }
  componentDidMount(){
    this.getAllBooks()
  }
  componentWillReceiveProps(){
    this.getAllBooks()
  }
  getAllBooks(){
    BooksAPI.getAll().then((books) => {
      this.setState({books})
    })
  }
  updateShelfBook = (book, shelf) =>{  
    this.setState((state) => ({
      books: state.books.map(b => { 
        return b.id !== book.id ? b : Object.assign({}, b, {shelf})
      })
    }))
    BooksAPI.update(book,shelf)
  }
  getBooksSearch = (query) => {
    if (query.length >= 3){
      BooksAPI.search(query).then((result) => {
        if(result.error){
          this.setState({resultBooks: []})
          return
        }
        let result2 = result.map(s => {
          let bookShelf = this.state.books.find(
            bookShelf => s.id === bookShelf.id
          )
          if(bookShelf){
            return Object.assign({}, s, {shelf: bookShelf.shelf})
          }
          return s
        })
        this.setState({resultBooks : result2})        
      })
    } else {
      this.setState({resultBooks : []})
    }
  }
  clearQuery = () => {
    this.setState({ resultBooks : [] })
  }
  render() {
    return (
      <div className="app">
          <Route exact path='/' render={() => (
            <ListMyReads
              books={this.state.books}
              bookShelfChange={this.updateShelfBook}
            />
          )}/>
          <Route exact path='/search' render={() => (
            <Search
              bookResult={this.getBooksSearch}
              books={this.state.resultBooks}
              bookShelfChange={this.updateShelfBook}
              clearQuery={this.clearQuery}
            />
          )}/>
      </div>
    )
  }
}

export default BooksApp
