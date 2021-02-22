import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import { BeagleProvider, BeagleRemoteView } from '@zup-it/beagle-react'
import beagleService from './beagle'

const AppComponent = () => (
  <BeagleProvider value={beagleService}>
    <BeagleRemoteView route="/button"></BeagleRemoteView>
  </BeagleProvider>
)

render(<AppComponent />, document.getElementById('root'))
