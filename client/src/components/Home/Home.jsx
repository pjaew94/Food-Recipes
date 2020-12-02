import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import { searchRecipes } from './../../redux/actions/search';


const Home = props => {

    const dispatch = useDispatch()



    const clickMe = () => {
        dispatch(searchRecipes("pizza"))
    }
    
    return (
        <div>
            <button onClick={() => clickMe()} >Click me</button>
        </div>
    )
}

Home.propTypes = { 

}

export default Home
