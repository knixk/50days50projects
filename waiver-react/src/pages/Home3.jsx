{participants.map((participant, index) => (
  <Grid
    container
    spacing={2}
    style={{ marginTop: 10 }}
    alignItems="center"
    key={participant.id}
  >
    <Grid item xs={5}>
      <TextField
        fullWidth
        label="Name"
        value={participant.name}
        onChange={(e) =>
          updateParticipant(index, "name", e.target.value)
        }
      />
    </Grid>
    <Grid item xs={5}>
      <TextField
        fullWidth
        label="Age"
        type="number"
        value={participant.age}
        onChange={(e) =>
          updateParticipant(index, "age", e.target.value)
        }
      />
    </Grid>
    <Grid item xs={2}>
      <IconButton
        onClick={() => deleteParticipant(participant.id)}
      >
        {/* <HighlightOffIcon /> */}
        {/* <deleteIcon> */}
        <img style={{ width: 30 }} src={deleteIcon} />
      </IconButton>
    </Grid>
  </Grid>
))}