const Voices = {
  OLIVIA: {voice: 'Whimsical', alt: 'Olivia'},
  EMILY: {voice: 'Cartoon Baby', alt: 'Emily'},
  JOE: {voice: 'Cartoon Kid', alt: 'Joe'},
  JESSICA: {voice: 'Rubie', alt: 'Jessica'},
  MARK: {voice: 'Connor', alt: 'Mark'},
};

const findByVoice=(voice)=>{
  Object.keys(StateValue).find(
      (key) => StateValue[key] === 2,
  );
};

module.exports = Voices;
