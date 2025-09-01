import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import useLocalStorage from '../../../hooks/useLocalStorage/useLocalStorage';

// MUI
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import InputAdornment from '@mui/material/InputAdornment';

// Types
import type { Model } from '../../../types/model.type';

// List of Models
import { models } from '../../../consts/modelList';

interface FormValues {
   message: string;
}

interface MessageBoxFormProps {
   onFormSubmit: (message: FormValues, model: string) => void;
   disableSubmit?: boolean;
   clearMessages: () => void;
}
function MessageBoxForm({
   onFormSubmit,
   disableSubmit = false,
   clearMessages,
}: MessageBoxFormProps) {
   const { handleSubmit, register, reset, watch } = useForm<FormValues>();

   const message = watch('message');
   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
   const [selectedModel, setModel] = useLocalStorage<string>('SV-Model', 'local');

   const onSubmit: SubmitHandler<FormValues> = (data) => {
      reset();
      onFormSubmit(data, selectedModel);
   };

   return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
         <Box display="flex" gap={1}>
            <TextField
               fullWidth
               multiline
               maxRows={4}
               placeholder="Type your message..."
               onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();

                     if (disableSubmit || message?.length === 0) return;

                     handleSubmit(onSubmit)();
                  }
               }}
               {...register('message')}
               slotProps={{
                  input: {
                     endAdornment: (
                        <InputAdornment position="end">
                           <IconButton
                              onClick={(e) => setAnchorEl(e.currentTarget)}
                              aria-describedby="model-selector"
                           >
                              <Chip
                                 color="primary"
                                 label={models.find((model) => selectedModel === model.model)?.name}
                              />
                           </IconButton>
                           <Popover
                              id="model-selector"
                              open={Boolean(anchorEl)}
                              anchorEl={anchorEl}
                              onClose={() => setAnchorEl(null)}
                              anchorOrigin={{
                                 vertical: 'top',
                                 horizontal: 'left',
                              }}
                              transformOrigin={{
                                 vertical: 'bottom',
                                 horizontal: 'right',
                              }}
                           >
                              <List>
                                 {models.map((model, i) => (
                                    <ModelListItem
                                       model={model}
                                       key={i}
                                       selectedModel={selectedModel}
                                       handelModelChange={(model) => {
                                          setModel(model);
                                          setAnchorEl(null);
                                          clearMessages();
                                       }}
                                    />
                                 ))}
                              </List>
                           </Popover>
                        </InputAdornment>
                     ),
                  },
               }}
            />

            <IconButton
               color="primary"
               type="submit"
               disabled={disableSubmit || message?.length === 0}
            >
               <SendIcon />
            </IconButton>
         </Box>
      </Box>
   );
}

function ModelListItem({
   model,
   selectedModel,
   handelModelChange,
}: {
   model: Model;
   selectedModel: string;
   handelModelChange: (mode: string) => void;
}) {
   return (
      <ListItem sx={{ padding: 0 }}>
         <ListItemButton
            disabled={model.label === 'Coming Soon'}
            selected={model.model === selectedModel}
            onClick={() => {
               handelModelChange(model.model);
            }}
         >
            <ListItemText>
               {model.name} - {model.description}
            </ListItemText>
         </ListItemButton>
         {model.label && <Chip color={'warning'} label={model.label} sx={{ mx: 2 }} />}
      </ListItem>
   );
}

export default MessageBoxForm;
