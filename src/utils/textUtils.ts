import type { SymbolInfo } from '../types';

export const getShareText = (info: SymbolInfo): string => {
  let shareText = '';
  if (info.interpretations) {
    shareText = `${info.name}\n\nIndigenous: ${info.interpretations.indigenous}`;
    if (info.interpretations.cultural) shareText += `\n\nCultural: ${info.interpretations.cultural}`;
    if (info.interpretations.psychological) shareText += `\n\nPsychological: ${info.interpretations.psychological}`;
  } else {
    shareText = `${info.name}\n\n${info.meaning}`;
  }
  return shareText;
};
