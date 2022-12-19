import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { CalendarIcon, EllipsisHorizontalIcon, MapPinIcon, TagIcon } from '@heroicons/react/20/solid';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import * as date from '../../utils/date';

const LessonItem = ({ lesson, cancelLesson }) => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  return (
    <li key={lesson._id} className="relative flex space-x-6 py-6 xl:static">
      <div className="rounded-full overflow-hidden bg-gray-100 h-14 w-14">
        <ProfilePicture avatarUrl={lesson.student.avatarUrl} />
      </div>
      <div className="flex-auto">
        <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
          {lesson.student.firstName} {lesson.student.lastName}
        </h3>
        <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
          <div className="flex items-start space-x-3">
            <dt className="mt-0.5">
              <span className="sr-only">Date</span>
              <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd>
              <time dateTime={lesson.dateTime}>
                {date.getMonthDayYearFormatted(lesson.dateTime)} at {date.getStartTime(lesson.dateTime)}
              </time>
            </dd>
          </div>
          <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
            <dt className="mt-0.5">
              <span className="sr-only">Location</span>
              <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd>{lesson.location}</dd>
          </div>
          <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
            <dt className="mt-0.5">
              <span className="sr-only">Location</span>
              <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd>${lesson.price}</dd>
          </div>
        </dl>
      </div>
      <Menu as="div" className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center">
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm w-full text-left')}>
                    Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    data-lesson-id={lesson._id}
                    className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm w-full text-left')}
                    onClick={cancelLesson}
                  >
                    Cancel
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
};

export default LessonItem;