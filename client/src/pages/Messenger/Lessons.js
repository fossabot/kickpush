import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/Button/Button';
import LessonRequestForm from './LessonRequestForm';
import ProposedLessons from './ProposedLessons';
import ScheduledLessons from './ScheduledLessons';

import { acceptLesson as acceptLessonAction, cancelLesson as cancelLessonAction } from '../../state/lessons/lessonActions';

const Lessons = ({ loading, connection, lessons }) => {
  const [showLessonRequestForm, setShowLessonRequestForm] = useState(false);
  const [pendingLessons, setPendingLessons] = useState(lessons.filter((lesson) => lesson.status === 'pending'));
  const [scheduledLessons, setScheduledLessons] = useState(lessons.filter((lesson) => lesson.status === 'accepted'));
  const [showPendingLessons, setShowPendingLessons] = useState(pendingLessons.length > 0);
  const [editLesson, setEditLesson] = useState(null);

  useEffect(() => {
    lessons.sort((a, b) => b.dateTime - a.dateTime);
    setPendingLessons(lessons.filter((lesson) => lesson.status === 'pending'));
    setScheduledLessons(lessons.filter((lesson) => lesson.status === 'accepted'));
  }, [lessons]);

  const openLessonRequestForm = (lesson) => {
    setEditLesson(lesson);
    setShowLessonRequestForm(true);
  };

  const closeLessonRequestForm = () => {
    setShowLessonRequestForm(false);
  };

  const setShowPendingLessonsTrue = () => {
    setShowPendingLessons(true);
  };

  const setShowPendingLessonsFalse = () => {
    setShowPendingLessons(false);
  };

  const acceptLesson = (e) => {
    acceptLessonAction(e.target.getAttribute('data-lesson-id'));
  };

  const cancelLesson = (e) => {
    if (e.target) {
      cancelLessonAction(e.target.getAttribute('data-lesson-id'));
    } else {
      // A lesson object was passed in from the ScheduledLessonEditModal
      cancelLessonAction(e._id);
    }
  };

  lessons = lessons.map((lesson) => {
    lesson.dateTime = new Date(lesson.dateTime);
    return lesson;
  });

  return (
    <>
      <div className="flex justify-center gap-2 px-3 mb-4 fixed right-0 left-0 bg-white pb-4">
        <div
          onClick={setShowPendingLessonsTrue}
          className={`px-4 py-3 rounded-md w-1/2 text-center ${showPendingLessons ? 'bg-primary text-white' : 'bg-gray-100'}`}
        >
          Propositions
        </div>
        <div
          onClick={setShowPendingLessonsFalse}
          className={`px-4 py-3 rounded-md w-1/2 text-center ${!showPendingLessons ? 'bg-primary text-white' : 'bg-gray-100'}`}
        >
          Lessons
        </div>
      </div>
      {/* 
        TODO: Put this into a separate component that takes in a hidden property (or just add a 
        comment here indicating that this is invisible to ensure the fixed component above actually
        takes up space) 
      */}
      <div className="flex justify-center gap-2 px-3 mb-4 bg-white pb-4 invisible">
        <div
          onClick={setShowPendingLessonsTrue}
          className={`px-4 py-3 rounded-md w-1/2 text-center ${showPendingLessons ? 'bg-primary text-white' : 'bg-gray-100'}`}
        >
          Propositions
        </div>
        <div
          onClick={setShowPendingLessonsFalse}
          className={`px-4 py-3 rounded-md w-1/2 text-center ${!showPendingLessons ? 'bg-primary text-white' : 'bg-gray-100'}`}
        >
          Lessons
        </div>
      </div>
      <main className="flex px-6 w-full mb-32">
        <ProposedLessons
          lessons={pendingLessons}
          show={showPendingLessons}
          loading={loading}
          openLessonRequestForm={openLessonRequestForm}
          closeLessonRequestForm={closeLessonRequestForm}
          acceptLesson={acceptLesson}
          cancelLesson={cancelLesson}
        />
        <ScheduledLessons
          lessons={scheduledLessons}
          show={!showPendingLessons}
          loading={loading}
          openLessonRequestForm={openLessonRequestForm}
          closeLessonRequestForm={closeLessonRequestForm}
          cancelLesson={cancelLesson}
        />
        <div className="bottom-0 left-0 w-full flex justify-center pt-4 pb-6 px-12 fixed bg-white shadow-inner">
          <Button content="Propose a New Lesson" extraClasses={''} isPrimary={true} size={'large'} onClick={(event) => openLessonRequestForm(null)} />
        </div>
      </main>
      <LessonRequestForm lesson={editLesson} showForm={showLessonRequestForm} closeForm={closeLessonRequestForm} connection={connection} />
    </>
  );
};

// mapStateToProps
const mapStateToProps = (state) => ({
  lessons: state.lesson.lessons
});

export default connect(mapStateToProps)(Lessons);
