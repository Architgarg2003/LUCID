import React from 'react';

const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        return "Good Morning";
    } else if (currentHour < 18) {
        return "Good Afternoon";
    } else if (currentHour < 21) {
        return "Good Evening";
    } else {
        return "Good Night";
    }
};

const Greeting = () => {
    const greeting = getGreeting();

    return (
        <div >
            {greeting}!
        </div>
        
    );
};

export default Greeting;
