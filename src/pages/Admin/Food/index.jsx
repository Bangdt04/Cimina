import FoodList from "./FoodList";
import FoodHead from "./FoodHead";
import './food.scss'

function FoodPage(){
    return (
        <div className="food-container h-full flex flex-col">
            <FoodHead />
            <FoodList />
        </div>
    );
}

export default FoodPage;