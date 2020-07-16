import PropTypes from 'prop-types'
import React from 'react'

const Handle = ({
  error,
  domain: [min, max],
  handle: { id, value, percent },
  disabled,
  getHandleProps,
}) => {
  const leftPosition = `${percent}%`

  return (
    <>
      <div className='handle__wrapper' style={{ left: leftPosition }} {...getHandleProps(id)} />
      <div
        role='slider'
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={`handle__container${disabled ? '__disabled' : ''}`}
        style={{ left: leftPosition }}
      >
        <div className={`handle__marker${error ? '__error' : ''}`} />
      </div>
    </>
  )
}

Handle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
}

Handle.defaultProps = { disabled: false }

export default Handle
