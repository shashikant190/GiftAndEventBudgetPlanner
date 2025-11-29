import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GiftsToGive } from './GiftsToGive';
import { GiftsReceived } from './GiftsReceived';
import { GiftSuggestions } from './GiftSuggestions';

interface EventGiftsProps {
  eventId: string;
  eventType: string;
}

export function EventGifts({ eventId, eventType }: EventGiftsProps) {
  return (
    <Tabs defaultValue="to-give" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="to-give">Gifts To Give</TabsTrigger>
        <TabsTrigger value="received">Gifts Received</TabsTrigger>
        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
      </TabsList>

      <TabsContent value="to-give">
        <GiftsToGive eventId={eventId} />
      </TabsContent>

      <TabsContent value="received">
        <GiftsReceived eventId={eventId} />
      </TabsContent>

      <TabsContent value="suggestions">
        <GiftSuggestions eventType={eventType} />
      </TabsContent>
    </Tabs>
  );
}
