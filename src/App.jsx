import { Link, Routes, Route } from 'react-router-dom';
import RandomQuoteGenerator from './apps/random_quote_generator/RandomQuoteGenerator';
import ToDoList from './apps/todo_list/ToDoList';
import OnlineStore from './apps/online_store/OnlineStore'
import MovieSearchExplorer from './apps/movie_search/MovieSearchExplorer';
import ManageFormInputs from './apps/handle_form_inputs/HandleFormInputs';
import randomQuoteImage from './apps/random_quote_generator/display.png';
import todoImage from './apps/todo_list/display.png';
import onlineStoreImage from './apps/online_store/display.png'
import movieSearchExplorerImage from './apps/movie_search/display.png';
import handleFormInputsImage from './apps/handle_form_inputs/display.png';
import './App.css'

function Container({ title, description, image, imageAlt, linkToApp }) {
    return (
        <Link to={linkToApp} className='project'>
            <img src={image} alt={imageAlt}/>
            <h3>{title}</h3>
            <p>{description}</p>
        </Link>
    );
}

function Dashboard() {
    const projects = [
        {
            title: 'Random Quote Generator',
            description: 'Demonstrates asynchronous API fetching, state management, and React component lifecycles.',
            image: randomQuoteImage,
            imageAlt: 'A preview of the random quote generator.',
            linkToApp: '/quote'
        },
        {
            title: 'ToDo List',
            description: 'Showcases controlled form inputs, immutable array state management, and dynamic list rendering in React.',
            image: todoImage,
            imageAlt: 'A preview of the todo list.',
            linkToApp: '/todo_list'
        },
        {
            title: 'Online Store',
            description: 'A fully functional e-commerce storefront featuring a dynamic shopping cart and category filtering. Demonstrates advanced React state management, dynamic array manipulation, and real-time data filtering.',
            image: onlineStoreImage,
            imageAlt: 'A preview of the online store.',
            linkToApp: '/online_store'
        },
        {
            title: 'Movie Search Explorer',
            description: 'A TMDB-powered application demonstrating REST API integration, debounced search state, and dynamic data presentation.',
            image: movieSearchExplorerImage,
            imageAlt: 'A preview of the movie search explorer.',
            linkToApp: '/movie_search'
        },
        {
            title: 'Handle Form Inputs',
            description: 'A responsive React registration form featuring real-time password strength tracking, live field validation, and smooth in-page feedback for a seamless user onboarding experience.',
            image: handleFormInputsImage,
            imageAlt: 'A preview of the handle form inputs.',
            linkToApp: '/handle_form_inputs'
        }
    ]

    return (
        <div>
            <h1 className='title'>React Project Portfolio</h1>
            <p className='description'>A collection of responsive web applications built with React.
                Each project demonstrates core front-end concepts,
                from asychronous API fetching to complex state management and dynamic routing</p>

            <h2 className='section-title'>Projects</h2>
            <div className='projects-container'>
                {projects.map((project) => <Container key={project.title} title={project.title} description={project.description} image={project.image} imageAlt={project.imageAlt} linkToApp={project.linkToApp} />)}
            </div>
        </div>
    );
}

function App() {
    return(
        <Routes>
            <Route path='/' element={<Dashboard />}/>
            <Route path='/quote' element={<RandomQuoteGenerator />} />
            <Route path='/todo_list' element={<ToDoList />} />
            <Route path='/online_store' element={<OnlineStore />} />
            <Route path='/movie_search' element={<MovieSearchExplorer />} />
            <Route path='/movie_search/*' element={<MovieSearchExplorer />} />
            <Route path='/handle_form_inputs' element={<ManageFormInputs />} />
        </Routes>
    );
}

export default App
