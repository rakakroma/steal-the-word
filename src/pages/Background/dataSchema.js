import { z } from 'zod';

//------------------wordData-----------------

export const DefinitionSchema = z.object({
  annotation: z.string(),
  definitionId: z.string(),
  note: z.string(),
  tags: z.array(z.string()), //array of tag ids
});

export const WordSchema = z.object({
  id: z.string(),
  word: z.string(),
  definitionCount: z.number(),
  definitions: z.array(DefinitionSchema),
  matchRule: z.string().optional(),
  stem: z.string().optional(),
  variants: z.array(z.string()).optional(),
  stars: z.number().optional(),
});

export const WordListSchema = z.array(WordSchema);

//------------------domainData-----------------

export const DomainAndLinkSchema = z.object({
  url: z.string(),
  activate: z.boolean().nullable(),
  floatingWindow: z.boolean().nullable(),
  mouseTool: z.boolean().nullable(),
  icon: z.string().nullable().optional(),
  id: z.number(),
});

export const DomainAndLinkListSchema = z.array(DomainAndLinkSchema);

//------------------contextData-----------------

export const ContextSchema = z.object({
  context: z.string(),
  wordId: z.string(),
  date: z.number(),
  definitionRef: z.string(),
  pageTitle: z.string(),
  phrase: z.string().nullable().optional(),
  url: z.string(),
  id: z.number(),
});

export const ContextListSchema = z.array(ContextSchema);

//------------------tagData-----------------

export const wordDefRefSchema = z.object({
  wordId: z.string(),
  defId: z.string(),
});

export const TagSchema = z.object({
  id: z.string(),
  tag: z.string(),
  wordDefRefs: z.array(wordDefRefSchema),
});

export const TagListSchema = z.array(TagSchema);

//------------------wholeData-----------------

export const WholeDataSchema = z.object({
  tagList: TagListSchema,
  contextList: ContextListSchema,
  wordList: WordListSchema,
  domainAndLinkList: DomainAndLinkListSchema,
});
