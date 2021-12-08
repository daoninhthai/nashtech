import React, {useState} from 'react';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const SelectDate = ({setSelectDate, values, close}) => {
    const [value, onChange] = useState(new Date());
    setSelectDate(moment(value).format('DD/MM/YYYY'));
    values.assignedDate = moment(value).format('DD/MM/YYYY');
    const date = new Date();
    return (
        <Calendar
            onChange={onChange}
            value={value}
            minDate={date}
        >
        </Calendar>
    );
};

export default SelectDate;