// components/Chatbar/components/Conversation.tsx

import {
  IconCheck,
  IconMessage,
  IconPencil,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  DragEvent,
  KeyboardEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Conversation } from '@/types/chat';
import HomeContext from '@/pages/api/home/home.context';
import ChatbarContext from '@/components/Chatbar/Chatbar.context';
import SidebarActionButton from '@/components/Buttons/SidebarActionButton';

interface Props {
  conversation: Conversation;
}

export const ConversationComponent = ({ conversation }: Props) => {
  const {
    state: { selectedConversation, messageIsStreaming },
    dispatch,
    handleUpdateConversation,
  } = useContext(HomeContext);

  const { handleDeleteConversation } = useContext(ChatbarContext);

  // Define handleSelectConversation locally
  const handleSelectConversation = (conv: Conversation) => {
    // IMPORTANT: add `type: 'change'` here
    dispatch({ type: 'change', field: 'selectedConversation', value: conv });
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      selectedConversation && handleRename(selectedConversation);
    }
  };

  const handleRename = (c: Conversation) => {
    if (renameValue.trim().length > 0) {
      handleUpdateConversation(c, { key: 'name', value: renameValue });
      setRenameValue('');
      setIsRenaming(false);
    }
  };

  const handleConfirm: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (isDeleting) {
      handleDeleteConversation(conversation);
    } else if (isRenaming) {
      handleRename(conversation);
    }
    setIsDeleting(false);
    setIsRenaming(false);
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(false);
    setIsRenaming(false);
  };

  const handleOpenRenameModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    selectedConversation && setRenameValue(selectedConversation.name);
  };

  const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  const handleDragStart = (e: DragEvent<HTMLButtonElement>, c: Conversation) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('conversation', JSON.stringify(c));
    }
  };

  useEffect(() => {
    if (isRenaming) setIsDeleting(false);
    if (isDeleting) setIsRenaming(false);
  }, [isRenaming, isDeleting]);

  const isSelected = selectedConversation?.id === conversation.id;

  return (
    <div className="relative flex items-center">
      {isRenaming && isSelected ? (
        <div className="flex w-full items-center gap-3 rounded-lg bg-gray-700 p-3">
          <IconMessage size={18} />
          <input
            className="mr-12 flex-1 overflow-hidden overflow-ellipsis bg-transparent text-left text-[12.5px] leading-3 text-white outline-none"
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={handleEnterDown}
            autoFocus
          />
        </div>
      ) : (
        <button
          className={`
            flex w-full items-center gap-3 rounded-lg p-3 text-sm
            text-white transition-colors duration-200
            ${isSelected ? 'bg-gray-700' : 'hover:bg-gray-700'}
            ${messageIsStreaming ? 'disabled:cursor-not-allowed' : ''}
          `}
          onClick={() => handleSelectConversation(conversation)}
          disabled={messageIsStreaming}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, conversation)}
        >
          <IconMessage size={18} />
          <div
            className={`
              relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3
              ${isSelected ? 'pr-12' : 'pr-1'}
            `}
          >
            {conversation.name}
          </div>
        </button>
      )}

      {(isDeleting || isRenaming) && isSelected && (
        <div className="absolute right-1 z-10 flex text-white">
          <SidebarActionButton handleClick={handleConfirm}>
            <IconCheck size={18} />
          </SidebarActionButton>
          <SidebarActionButton handleClick={handleCancel}>
            <IconX size={18} />
          </SidebarActionButton>
        </div>
      )}

      {isSelected && !isDeleting && !isRenaming && (
        <div className="absolute right-1 z-10 flex text-white">
          <SidebarActionButton handleClick={handleOpenRenameModal}>
            <IconPencil size={18} />
          </SidebarActionButton>
          <SidebarActionButton handleClick={handleOpenDeleteModal}>
            <IconTrash size={18} />
          </SidebarActionButton>
        </div>
      )}
    </div>
  );
};

export default ConversationComponent;
