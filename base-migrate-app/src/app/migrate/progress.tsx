import React from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import { GoodIcon, LineIcon, LoadingIcon } from '../../../public/icons';

const steps = [
  {
    title: 'Token contract deployed',
    status: 'pending',
    time: '',
  },
  {
    title: 'Contract verified',
    status: 'stale',
    time: '',
  },
  {
    title: 'Forking superchain token list to github repo',
    status: 'stale',
    time: '',
  },
  {
    title: 'Adding token data to the forked superchain repo',
    status: 'stale',
    time: '',
  },
  {
    title: 'Preparing PR on the superchain repo',
    status: 'stale',
    time: '',
  },
];

interface Prop {
  next: () => void;
  isPending: boolean;
  isConfirmed: boolean;
  isDone: boolean;
  refresh: boolean;
}
const MigrationProgress = ({ next, isPending, isConfirmed, isDone, refresh }: Prop) => {
  const [data, setData] = useState(steps);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (isPending || !isConfirmed) return;

      if (step === 3 && !isDone) return;

      if (step === 4) {
        next();
        return toast('Migration complete', {
          type: 'success',
        });
      }

      const newData = [...data];

      if (newData[step].status !== 'completed') {
        newData[step].time = moment().format('h:mm a');
        newData[step].status = 'completed';
      }
      if (step !== 4) {
        newData[step + 1].status = 'pending';
      }

      setData([...newData]);

      setStep(step + 1);
    }, 3500);
  }, [step, isPending, isConfirmed]);

  useEffect(() => {
    if (refresh) {
      setData({ ...steps });
      setStep(0);
      return;
    }
  }, [refresh]);

  return (
    <div className="flex flex-col gap-2">
      {data?.map((item, index) => (
        <div key={index}>
          <div className="flex items-center justify-between bg-black-400 min-h-9 lg:min-h-10 rounded-[10px] p-2">
            <div className="flex items-center gap-3">
              <div
                className={classNames(
                  'h-5 w-5 md:h-6 md:w-6 rounded-full flex items-center justify-center font-medium text-[10px] md:text-xs text-center transition-all',
                  {
                    'bg-green-50': item.status === 'completed',
                    'bg-black-450 text-white-50': item.status === 'pending',
                    'bg-white-50 border border-dashed border-white-200 text-grey-100':
                      item.status === 'stale',
                  },
                )}>
                {item.status === 'completed' ? <GoodIcon /> : <div>{index + 1}</div>}
              </div>
              <div
                className={classNames('text-xs md:text-sm transition-all max-w-[85%]', {
                  'text-grey-50 font-medium': item.status === 'pending',
                  'text-grey-100': item.status !== 'pending',
                })}>
                {item.title}
              </div>
            </div>
            <div className="text-grey-100 text-[10px]">
              {item.status === 'completed' && item.time}

              {item.status === 'pending' && (
                <div className="animate-spin">
                  <LoadingIcon />
                </div>
              )}
            </div>
          </div>

          {item.status === 'completed' && index !== steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center my-2">
              <LineIcon />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MigrationProgress;
