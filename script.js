// Global Vars
const noteContents = [
  "Missed mistakes",
  "Reporting results",
  "Designing experiments",
  "Hard to reproduce analyses",
  "Hard to find files",
  "Data loss and corruption",
  "Deviating from lab protocols",
  "Difficulty onboarding + offboarding"
];


// Populate the carousel with notes
document.addEventListener('DOMContentLoaded', () => {

  const carouselTrack = document.querySelector(".carousel-track");

  noteContents.forEach(content => {
    // Create the list item for the slide
    const li = document.createElement('li');
    li.className = 'carousel-slide';

    // Create the note container
    const note = document.createElement('div');
    note.className = 'note carousel-note';
    note.setAttribute('draggable', true);

    // Create the note content container
    const noteContent = document.createElement('div');
    noteContent.className = 'note-content';
    noteContent.textContent = content;

    // Nest the elements correctly
    note.appendChild(noteContent);
    li.appendChild(note);
    carouselTrack.appendChild(li);
  });

  slides = document.querySelectorAll(".carousel-slide");
  totalSlides = slides.length;
});



let slideIndex = 0;
let slides = document.querySelectorAll(".carousel-slide");
let totalSlides = slides.length;

function moveSlide(step) {
  slideIndex = (slideIndex + step + totalSlides) % totalSlides;
  const track = document.querySelector(".carousel-track");
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = 'translateX(-' + slideIndex * slideWidth + 'px)';
}


// Drag and Drop logic

document.addEventListener('DOMContentLoaded', (event) => {
  let dragged = null;
  let offsetX = 0;
  let offsetY = 0;

  document.querySelectorAll('.carousel-note').forEach((note) => {
    note.addEventListener('dragstart', function(e) {
      dragged = this;
      offsetX = e.clientX - dragged.getBoundingClientRect().left;
      offsetY = e.clientY - dragged.getBoundingClientRect().top;
      e.dataTransfer.setData('text', ''); // DataTransfer object requires setting some data.
      e.dataTransfer.effectAllowed = 'move';
    });
  });

  const whiteboard = document.querySelector('.whiteboard');
  whiteboard.addEventListener('dragover', function(e) {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  });

  whiteboard.addEventListener('drop', function(e) {
    e.preventDefault();
    if (dragged) {
      const whiteboardRect = whiteboard.getBoundingClientRect();
      // Calculate the position to place the note within the whiteboard
      const x = e.clientX - whiteboardRect.left - offsetX;
      const y = e.clientY - whiteboardRect.top - offsetY;

      const xPercent = (x / whiteboardRect.width) * 100;
      const yPercent = (y / whiteboardRect.height) * 100;

      // Clone the note, set the cloned note's position, and append it to the whiteboard
      const noteClone = dragged.cloneNode(true);
      noteClone.classList.remove('carousel-note');

      noteClone.style.left = `${xPercent}%`;
      noteClone.style.top = `${yPercent}%`;

      console.log('x:', x, 'y:', y);

      whiteboard.appendChild(noteClone);
      noteClone.addEventListener('dragstart', handleDragStartWithinBoard);

      dragged.remove(); // Remove the note from the carousel
      slides = document.querySelectorAll(".carousel-slide"); // Re-select slides
      updateCarousel(); // Adjust carousel for the missing space
    }
  });

  function handleDragStartWithinBoard(e) {
    dragged = this;
    offsetX = e.clientX - dragged.getBoundingClientRect().left;
    offsetY = e.clientY - dragged.getBoundingClientRect().top;
    e.dataTransfer.setData('text', '');
    e.dataTransfer.effectAllowed = 'move';
  }

  // Update carousel slides
  function updateCarousel() {
    // This assumes the width of each slide is fixed and known.
    // Recalculate the slideIndex based on remaining slides
    slideIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));
  
    // Remove the empty slides that no longer have notes
    slides.forEach((slide, index) => {
      if (slide.children.length === 0) {
        slide.remove();
        if (index < slideIndex) {
          slideIndex--;
        }
      }
    });

  }
});



function handleNextBtn(phase) {
  if (phase === 1) {

    // Based on the note data in noteContents, create a note for each item and append it to phase2-sticky-notes
    // const phase2StickyNotes = document.getElementById("phase2-sticky-notes");
    // noteContents.forEach(content => {
    //   const note = document.createElement('div');
    //   note.className = 'vertical-note';
    //   note.textContent = content;
    //   phase2StickyNotes.appendChild(note);
    // });

    /*
      re-create the previous snippet with requirements
      - Each note should be selectable by hover or click
      - Upon selection of one of these notes
        - The note should be rendered in the note preview area
        - The note should be highlighted purple
        - The note should be rendered on the whiteboard
    */
    const phase2StickyNotes = document.getElementById("phase2-sticky-notes");
    const notePreview = document.getElementById("note-preview");
    const whiteboard = document.querySelector('#phase2-whiteboard');

    noteContents.forEach(content => {
      const note = document.createElement('div');
      note.className = 'vertical-note';
      note.textContent = content;

      note.addEventListener('click', function() {
        // Clear the note preview
        notePreview.textContent = '';

        // Set the note preview to the clicked note
        notePreview.textContent = content;

        // Highlight the clicked note
        const selectedNotes = document.querySelectorAll('.vertical-note.selected');
        selectedNotes.forEach(note => note.classList.remove('selected'));
        this.classList.add('selected');


        // Clear the whiteboard
        whiteboard.innerHTML = '';

        // Render the note on the whiteboard
        const noteClone = this.cloneNode(true);
        noteClone.classList.remove('vertical-note');
        noteClone.classList.add('whiteboard-note');
        noteClone.style.left = '50%';
        noteClone.style.top = '50%';
        whiteboard.appendChild(noteClone);
        // noteClone.addEventListener('dragstart', handleDragStartWithinBoard);
      });

      phase2StickyNotes.appendChild(note);
    }
    );


    // Hide phase 1 and show phase 2
    document.getElementById("phase1").style.display = "none";
    document.getElementById("phase2").style.display = "block";
  } else if (phase === 2) {
    document.getElementById("phase2").style.display = "none";
    document.getElementById("phase3").style.display = "block";
  }

// function renderNotePreview(note) {
//   const notePreview = document.getElementById("note-preview");
//   notePreview.textContent = note;
// }
// function renderSessionNotes(notes) {
//   const sessionNotes = document.getElementById("session-notes");
//   notes.forEach(note => {
//     const noteDiv = document.createElement('div');
//     noteDiv.className = 'note';
//     noteDiv.textContent = note;
//     sessionNotes.appendChild(noteDiv);
//   });
}

// call handleNextBtn manually to populate phase 2
// handleNextBtn(1);