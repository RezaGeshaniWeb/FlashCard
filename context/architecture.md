# Architecture

## Architecture Style

Feature-Based Architecture with Next.js 16 App Router

Each feature owns its:

- components
- hooks
- services
- types
- utils

Route segments live under `app/`.

---

## Folder Structure

src/

app/

assets/

components/

features/

hooks/

layouts/

services/

store/

types/

utils/

constants/

---

## Feature Structure

features/

deck/

components/

hooks/

services/

types/

utils/

---

## Layers

### Presentation

App Router pages (`app/`)

Layouts

Components

---

### Business

Hooks

Store (Client Components)

Validation

Permissions

Server Actions

---

### Data

API Services

TanStack Query

Server Components / fetch

Axios

Route Handlers

---

## Routing (App Router)

/

login

register

dashboard

decks

decks/[id]

study/[deckId]

statistics

profile

settings

not-found

---

## Authentication Flow

Login

↓

Receive JWT

↓

Store token (secure cookie preferred)

↓

Middleware validates session

↓

Fetch profile

↓

Navigate dashboard

---

## State Management

Server Components / Server Cache

↓

TanStack Query

↓

Zustand

↓

UI State

↓

Local Component State

---

## API Pattern

Page (Server or Client)

↓

Hook / Server Action

↓

Service

↓

Axios Client or Route Handler

↓

Backend

---

## Shared Components

Button

Input

Card

Modal

Dialog

Badge

Avatar

Dropdown

Tabs

Toast

Pagination

Search

Loader

Empty State

Error State

---

## Error Handling

error.tsx (segment)

↓

Page

↓

Feature

---

## Loading & Code Splitting

loading.tsx for route segments

dynamic() for heavy Client Components

Dashboard

Study

Statistics

Settings

Admin (future)

---

## Performance

Server Components by default

next/image for Image Optimization

Request Caching

Code Splitting

Link Prefetch

Suspense Boundaries

---

## Future Architecture

Offline Support

PWA

Background Sync

AI Module

Plugin System

Multi-language

Real-time Collaboration
