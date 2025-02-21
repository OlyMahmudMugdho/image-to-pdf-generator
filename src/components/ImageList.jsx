import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from './Button.jsx';

function ImageList({ images, onDragEnd, onCropClick }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="images">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {images.map((image, index) => (
              <Draggable key={image.id} draggableId={image.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="card bg-base-100 shadow-md p-4"
                  >
                    <img
                      src={image.cropped || image.url}
                      alt="preview"
                      className="w-full h-32 object-cover rounded-md mb-2"
                      onError={(e) => console.error('Thumbnail failed to load:', e)}
                    />
                    <Button onClick={() => onCropClick(image)} className="btn btn-secondary btn-sm">
                      Crop
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default ImageList;