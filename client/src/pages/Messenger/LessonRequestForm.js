import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

import Button from '../../components/Button/Button';
import SelectableItem from '../../components/SelectableItem/SelectableItem';

const LessonRequestForm = ({ showForm, closeForm, connection, user }) => {
  let familyMembers = [];

  if (user.accountType === 'instructor') {
    familyMembers = connection.studentProfile.familyMembers;
  } else {
    familyMembers = user.studentProfile.familyMembers;
  }

  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 9));
  const [duration, setDuration] = useState(60);
  const [showHoursLabel, setShowHoursLabel] = useState(true);
  const [showMinutesLabel, setShowMinutesLabel] = useState(false);
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState(20);

  useEffect(() => {
    if (duration >= 60) {
      setShowHoursLabel(true);
    } else {
      setShowHoursLabel(false);
    }

    if (duration % 60 !== 0) {
      setShowMinutesLabel(true);
    } else {
      setShowMinutesLabel(false);
    }
  }, [duration]);

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const incrementDuration = () => {
    setDuration(duration + 15);
  };

  const decrementDuration = () => {
    if (duration > 15) {
      setDuration(duration - 15);
    }
  };

  const onLocationChange = (e) => setLocation(e.target.value);
  const onHourlyRateChange = (e) => setHourlyRate(e.target.value);

  const incrementHourlyRate = () => setHourlyRate(hourlyRate + 1.0);
  const decrementHourlyRate = () => {
    if (hourlyRate > 0) {
      setHourlyRate(hourlyRate - 1.0);
    }
  };

  const submitLessonRequest = (e) => {
    e.preventDefault();
  };

  return (
    <Transition show={showForm} enter="transition ease-in-out duration-300 transform" enterFrom="translate-y-full" enterTo="translate-x-0" leave="transition-ease-in-out duration-300 transform" leaveFrom="translate-y-0" leaveTo="translate-y-full" className="h-screen w-full bg-white z-50 fixed top-0 flex flex-col">
      <header className="border-b p-4 border-gray-300 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Propose a New Lesson</h1>
        <FontAwesomeIcon icon={faTimes} className="cursor-pointer h-6 w-6 text-gray-600" onClick={closeForm} />
      </header>

      <div className="flex flex-col gap-4 p-4">
        <section className="flex flex-col p-2 gap-2">
          <h2>Date and Time</h2>
          <DatePicker className="focus:outline-none w-full border border-gray-400 border-opacity-60 py-2 px-4 rounded-lg" selected={startDate} onChange={(date) => setStartDate(date)} showTimeSelect filterTime={filterPassedTime} dateFormat="MMMM d, yyyy h:mm aa" timeIntervals={15} />
        </section>
        <section className="flex flex-col p-2 gap-2">
          <h2>Duration</h2>
          <div className="border border-gray-400 border-opacity-60 py-2 px-4 rounded-lg mb-4 flex justify-between">
            <div>
              <span id="duration">{duration / 60 >= 1 ? Math.floor(duration / 60) : ''}</span>
              <span className={!showHoursLabel && 'hidden'}>hr</span> <span id="minutesDuration">{duration % 60 !== 0 ? duration % 60 : ''}</span>
              <span className={!showMinutesLabel && 'hidden'} id="duration-label-minutes">
                min
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faMinusCircle} className="h-4 w-4 text-gray-600" onClick={decrementDuration} />
              <FontAwesomeIcon icon={faPlusCircle} className="h-4 w-4 cursor-pointer text-gray-600" onClick={incrementDuration} />
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <h2>Students</h2>
          <div className="flex justify-start flex-wrap gap-4">
            {familyMembers.map((familyMember, index) => (
              <SelectableItem key={index} value={`${familyMember._id}___${familyMember.name}___${familyMember.birthDate}`} content={familyMember.name} selected={false} />
            ))}
            <SelectableItem value="user" content="Myself" selected={false} />
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <h2>Location</h2>
          <input type="text" name="location" id="location" placeholder="Where will the lesson take place?" value={location} className="focus:outline-none w-full border border-gray-400 border-opacity-60 py-2 px-4 rounded-lg mb-4" onChange={onLocationChange} />
        </section>
        <section className="flex flex-col gap-2">
          <h2>Hourly Rate</h2>
          <div className="border border-gray-400 border-opacity-60 py-2 px-4 rounded-lg mb-4 flex justify-between">
            <div>
              $ <input type="number" name="rate" id="rate" value={hourlyRate} className="focus:outline-none w-3/4" onChange={onHourlyRateChange} />
            </div>
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faMinusCircle} className="h-4 w-4 text-gray-600" onClick={decrementHourlyRate} />
              <FontAwesomeIcon icon={faPlusCircle} className="h-4 w-4 cursor-pointer text-gray-600" onClick={incrementHourlyRate} />
            </div>
          </div>
        </section>
      </div>
      <footer className="flex justify-around p-8 fixed bottom-0 w-full bg-white">
        <Button content="Propose Lesson" isPrimary={true} size={'large'} onClick={submitLessonRequest} />
      </footer>
    </Transition>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user
});

export default connect(mapStateToProps)(LessonRequestForm);
